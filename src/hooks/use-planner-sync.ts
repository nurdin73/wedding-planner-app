import { useState, useEffect, useRef, useCallback } from 'react';
import type { AuthUser } from '../types/auth.types';
import type { WeddingPlannerState, SyncStatus } from '../types/wedding.types';
import {
  getOrCreateWedding,
  joinWeddingByCode,
  saveWeddingState,
  subscribeWeddingWorkspace,
  type WeddingWorkspaceData,
} from '../services/partner-collab.service';
import { loadPlannerState, savePlannerState } from '../utils/storage.utils';

interface UsePlannerSyncProps {
  user: AuthUser | null;
  state: WeddingPlannerState;
  setState: React.Dispatch<React.SetStateAction<WeddingPlannerState>>;
}

export function usePlannerSync({ user, state, setState }: UsePlannerSyncProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isPaired, setIsPaired] = useState(false);

  const isRemoteUpdateRef = useRef(false);
  const isInitialMountRef = useRef(true);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Initial workspace load or logout handling
  useEffect(() => {
    if (!user) {
      setSyncStatus('idle');
      setWeddingId(null);
      setInviteCode(null);
      setIsPaired(false);
      // Revert to local guest state
      const guestState = loadPlannerState(null);
      isRemoteUpdateRef.current = true;
      setState(guestState);
      return;
    }

    let isSubscribed = true;
    setSyncStatus('syncing');

    // Fast local user cache
    const cachedUserState = loadPlannerState(user.uid);
    if (cachedUserState.profile.isInitialized) {
      isRemoteUpdateRef.current = true;
      setState(cachedUserState);
    }

    async function initWorkspace() {
      if (!user) return;
      try {
        const workspace = await getOrCreateWedding(user, state);
        if (!isSubscribed || !workspace) return;

        setWeddingId(workspace.id);
        setInviteCode(workspace.inviteCode);
        setIsPaired(workspace.members.length > 1);

        if (workspace.plannerState && workspace.plannerState.profile.isInitialized) {
          isRemoteUpdateRef.current = true;
          setState(workspace.plannerState);
          savePlannerState(workspace.plannerState, user.uid);
        }

        setSyncStatus('saved');
        setLastSyncedAt(
          new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        );
      } catch (err) {
        console.error('[Collab] Workspace init error:', err);
        if (isSubscribed) setSyncStatus('error');
      }
    }

    initWorkspace();

    return () => {
      isSubscribed = false;
    };
  }, [user?.uid]);

  // 2. Real-time subscription to shared wedding workspace
  useEffect(() => {
    if (!weddingId || !user) return;

    const unsubscribe = subscribeWeddingWorkspace(
      weddingId,
      (workspace: WeddingWorkspaceData) => {
        isRemoteUpdateRef.current = true;
        setInviteCode(workspace.inviteCode);
        setIsPaired(workspace.members.length > 1);

        setState((prev) => ({
          ...workspace.plannerState,
          activeTab: prev.activeTab, // keep current active tab
        }));

        savePlannerState(workspace.plannerState, user.uid);
        setSyncStatus('saved');
        setLastSyncedAt(
          new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        );
      },
      () => {
        setSyncStatus('error');
      }
    );

    return () => unsubscribe();
  }, [weddingId, user?.uid]);

  // 3. Debounced save to shared Firestore wedding workspace
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }

    if (!user || !weddingId) return;

    setSyncStatus('syncing');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        await saveWeddingState(weddingId, state);
        savePlannerState(state, user.uid);
        setSyncStatus('saved');
        setLastSyncedAt(
          new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        );
      } catch (err) {
        console.error('[Collab] Failed to save state to shared workspace:', err);
        setSyncStatus('error');
      }
    }, 1000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [state, user?.uid, weddingId]);

  // 4. Join a partner's wedding with a code
  const joinWedding = useCallback(
    async (code: string) => {
      if (!user) throw new Error('Harap login terlebih dahulu untuk menghubungkan pasangan.');
      setSyncStatus('syncing');
      try {
        const workspace = await joinWeddingByCode(user, code);
        setWeddingId(workspace.id);
        setInviteCode(workspace.inviteCode);
        setIsPaired(workspace.members.length > 1);

        isRemoteUpdateRef.current = true;
        setState(workspace.plannerState);
        savePlannerState(workspace.plannerState, user.uid);

        setSyncStatus('saved');
        setLastSyncedAt(
          new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        );
      } catch (err) {
        setSyncStatus('error');
        throw err;
      }
    },
    [user]
  );

  return {
    syncStatus,
    lastSyncedAt,
    weddingId,
    inviteCode,
    isPaired,
    joinWedding,
  };
}
