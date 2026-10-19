import { useState, useEffect, useRef, useCallback } from 'react';
import type { AuthUser } from '../types/auth.types';
import type { WeddingPlannerState, SyncStatus, WorkspaceMemberInfo } from '../types/wedding.types';
import {
  getOrCreateWedding,
  joinWeddingByCode,
  saveWeddingState,
  subscribeWeddingWorkspace,
  type WeddingWorkspaceData,
} from '../services/partner-collab.service';
import { loadPlannerState, savePlannerState } from '../utils/storage.utils';
import { useNetworkStatus } from './use-network-status';
import { reconcilePlannerStates } from '../utils/sync-reconciliation.utils';

interface UsePlannerSyncProps {
  user: AuthUser | null;
  state: WeddingPlannerState;
  setState: React.Dispatch<React.SetStateAction<WeddingPlannerState>>;
}

export function usePlannerSync({ user, state, setState }: UsePlannerSyncProps) {
  const { isOnline } = useNetworkStatus();
  const [cloudStatus, setCloudStatus] = useState<Exclude<SyncStatus, 'offline'>>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isPaired, setIsPaired] = useState(false);
  const [membersInfo, setMembersInfo] = useState<WorkspaceMemberInfo[]>([]);

  // When offline, status is derived unconditionally as 'offline'
  const syncStatus: SyncStatus = !isOnline ? 'offline' : cloudStatus;

  const isRemoteUpdateRef = useRef(false);
  const isInitialMountRef = useRef(true);
  const hasPendingOfflineChangesRef = useRef(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stateRef = useRef(state);
  stateRef.current = state;
  const userRef = useRef(user);
  userRef.current = user;
  const setStateRef = useRef(setState);
  setStateRef.current = setState;

  // 1. Initial workspace load or logout handling
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        setCloudStatus('idle');
        setWeddingId(null);
        setInviteCode(null);
        setIsPaired(false);
        setMembersInfo([]);
        const guestState = loadPlannerState(null);
        isRemoteUpdateRef.current = true;
        setStateRef.current(guestState);
      }, 0);
      return () => clearTimeout(timer);
    }

    let isSubscribed = true;

    // Fast local user cache
    const cachedUserState = loadPlannerState(user.uid);
    if (cachedUserState.profile.isInitialized) {
      isRemoteUpdateRef.current = true;
      setStateRef.current(cachedUserState);
    }

    if (!isOnline) {
      return;
    }

    async function initWorkspace() {
      const currentUser = userRef.current;
      if (!currentUser) return;
      setCloudStatus('syncing');
      try {
        const workspace = await getOrCreateWedding(currentUser, stateRef.current);
        if (!isSubscribed || !workspace) return;

        setWeddingId(workspace.id);
        setInviteCode(workspace.inviteCode);
        setIsPaired(workspace.members.length > 1);
        if (workspace.membersInfo) {
          setMembersInfo(workspace.membersInfo);
        }

        if (workspace.plannerState && workspace.plannerState.profile.isInitialized) {
          isRemoteUpdateRef.current = true;
          // Reconcile with any offline modifications
          const resolvedState = hasPendingOfflineChangesRef.current
            ? reconcilePlannerStates(stateRef.current, workspace.plannerState)
            : workspace.plannerState;
          setStateRef.current(resolvedState);
          savePlannerState(resolvedState, currentUser.uid);
        }

        setCloudStatus('saved');
        setLastSyncedAt(
          new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        );
      } catch (err) {
        console.error('[Collab] Workspace init error:', err);
        if (isSubscribed) {
          setCloudStatus('error');
        }
      }
    }

    initWorkspace();

    return () => {
      isSubscribed = false;
    };
  }, [user?.uid, isOnline]);

  // 2. Real-time subscription to shared wedding workspace
  useEffect(() => {
    const currentUser = userRef.current;
    if (!weddingId || !currentUser || !isOnline) return;

    const unsubscribe = subscribeWeddingWorkspace(
      weddingId,
      (workspace: WeddingWorkspaceData) => {
        isRemoteUpdateRef.current = true;
        setInviteCode(workspace.inviteCode);
        setIsPaired(workspace.members.length > 1);
        if (workspace.membersInfo) {
          setMembersInfo(workspace.membersInfo);
        }

        const reconciled = hasPendingOfflineChangesRef.current
          ? reconcilePlannerStates(stateRef.current, workspace.plannerState)
          : workspace.plannerState;

        setStateRef.current((prev) => ({
          ...reconciled,
          activeTab: prev.activeTab,
        }));

        savePlannerState(reconciled, currentUser.uid);
        setCloudStatus('saved');
        setLastSyncedAt(
          new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        );
      },
      () => {
        setCloudStatus('error');
      }
    );

    return () => unsubscribe();
  }, [weddingId, isOnline]);

  // 3. Debounced save or offline queuing
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }

    if (!user) return;

    // Always persist to local device cache immediately
    savePlannerState(state, user.uid);

    // If currently offline, queue pending and defer cloud sync
    if (!isOnline) {
      hasPendingOfflineChangesRef.current = true;
      return;
    }

    if (!weddingId) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      setCloudStatus('syncing');
      try {
        await saveWeddingState(weddingId, state);
        hasPendingOfflineChangesRef.current = false;
        setCloudStatus('saved');
        setLastSyncedAt(
          new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        );
      } catch (err) {
        console.error('[Collab] Failed to save state to shared workspace:', err);
        if (!navigator.onLine) {
          hasPendingOfflineChangesRef.current = true;
        } else {
          setCloudStatus('error');
        }
      }
    }, 1000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [state, user?.uid, weddingId, isOnline]);

  // 4. Automatic reconnection sync flusher
  useEffect(() => {
    const currentUser = userRef.current;
    if (isOnline && hasPendingOfflineChangesRef.current && currentUser && weddingId) {
      const timer = setTimeout(() => {
        setCloudStatus('syncing');
        saveWeddingState(weddingId, stateRef.current)
          .then(() => {
            hasPendingOfflineChangesRef.current = false;
            setCloudStatus('saved');
            setLastSyncedAt(
              new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            );
          })
          .catch((err) => {
            console.error('[Collab] Auto-sync on reconnect error:', err);
            if (navigator.onLine) {
              setCloudStatus('error');
            }
          });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOnline, weddingId]);

  // 5. Join a partner's wedding with a code
  const joinWedding = useCallback(
    async (code: string) => {
      if (!user) throw new Error('Harap login terlebih dahulu untuk menghubungkan pasangan.');
      if (!isOnline) throw new Error('Menghubungkan pasangan membutuhkan koneksi internet aktif.');
      setCloudStatus('syncing');
      try {
        const workspace = await joinWeddingByCode(user, code);
        setWeddingId(workspace.id);
        setInviteCode(workspace.inviteCode);
        setIsPaired(workspace.members.length > 1);
        if (workspace.membersInfo) {
          setMembersInfo(workspace.membersInfo);
        }

        isRemoteUpdateRef.current = true;
        setState(workspace.plannerState);
        savePlannerState(workspace.plannerState, user.uid);

        setCloudStatus('saved');
        setLastSyncedAt(
          new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        );
      } catch (err) {
        setCloudStatus('error');
        throw err;
      }
    },
    [user, isOnline, setState]
  );

  return {
    syncStatus,
    lastSyncedAt,
    weddingId,
    inviteCode,
    isPaired,
    membersInfo,
    joinWedding,
  };
}

