import { useState, useEffect, useRef } from 'react';
import type { AuthUser } from '../types/auth.types';
import type { WeddingPlannerState, SyncStatus } from '../types/wedding.types';
import {
  fetchCloudPlanner,
  saveCloudPlanner,
  subscribeCloudPlanner,
} from '../services/firestore-sync.service';
import { loadPlannerState, savePlannerState } from '../utils/storage.utils';

interface UsePlannerSyncProps {
  user: AuthUser | null;
  state: WeddingPlannerState;
  setState: React.Dispatch<React.SetStateAction<WeddingPlannerState>>;
}

export function usePlannerSync({ user, state, setState }: UsePlannerSyncProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  const isRemoteUpdateRef = useRef(false);
  const isInitialMountRef = useRef(true);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Initial cloud fetch or migration when user logs in / logs out
  useEffect(() => {
    if (!user) {
      setSyncStatus('idle');
      // When logged out, revert to guest state from local storage
      const guestState = loadPlannerState(null);
      isRemoteUpdateRef.current = true;
      setState(guestState);
      return;
    }

    let isSubscribed = true;
    setSyncStatus('syncing');

    // Immediately load fast user cache if available
    const cachedUserState = loadPlannerState(user.uid);
    if (cachedUserState.profile.isInitialized) {
      isRemoteUpdateRef.current = true;
      setState(cachedUserState);
    }

    async function initializeCloudSync() {
      if (!user) return;
      try {
        const cloudData = await fetchCloudPlanner(user.uid);
        if (!isSubscribed) return;

        if (cloudData) {
          // Cloud data exists: sync down to local state and update local cache
          isRemoteUpdateRef.current = true;
          setState(cloudData);
          savePlannerState(cloudData, user.uid);
          setSyncStatus('saved');
          setLastSyncedAt(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
        } else {
          // First-time login: migrate current state up to Firestore & save to user cache
          await saveCloudPlanner(user.uid, state);
          if (!isSubscribed) return;
          savePlannerState(state, user.uid);
          setSyncStatus('saved');
          setLastSyncedAt(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (err) {
        console.error('[Cloud Sync] Failed to initialize cloud data:', err);
        if (isSubscribed) setSyncStatus('error');
      }
    }

    initializeCloudSync();

    // 2. Real-time snapshot listener for changes made from another device
    const unsubscribeSnapshot = subscribeCloudPlanner(
      user.uid,
      (remoteState) => {
        isRemoteUpdateRef.current = true;
        setState((prev) => ({
          ...remoteState,
          activeTab: prev.activeTab, // keep user's current local tab intact
        }));
        setSyncStatus('saved');
        setLastSyncedAt(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      },
      () => {
        setSyncStatus('error');
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribeSnapshot();
    };
  }, [user?.uid]);

  // 3. Debounced cloud save when state changes
  useEffect(() => {
    // Skip saving on very first render or when state update was from remote Firestore
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }

    if (!user) {
      return;
    }

    setSyncStatus('syncing');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        await saveCloudPlanner(user.uid, state);
        savePlannerState(state, user.uid);
        setSyncStatus('saved');
        setLastSyncedAt(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      } catch (err) {
        console.error('[Cloud Sync] Failed to save state to Firestore:', err);
        setSyncStatus('error');
      }
    }, 1000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [state, user?.uid]);

  return { syncStatus, lastSyncedAt };
}
