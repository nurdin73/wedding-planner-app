import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { AuthUser } from '../types/auth.types';
import type { WeddingPlannerState } from '../types/wedding.types';
import { sanitizeForFirestore } from './firestore-sync.service';

export interface WeddingWorkspaceData {
  id: string;
  ownerUid: string;
  members: string[];
  inviteCode: string;
  plannerState: WeddingPlannerState;
  updatedAt: string;
}

function generateCleanInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'SUCI-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function getOrCreateWedding(
  user: AuthUser,
  currentState: WeddingPlannerState
): Promise<WeddingWorkspaceData | null> {
  if (!db) return null;

  try {
    // 1. Check if user already has an active wedding linked
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    let weddingId: string = user.uid;

    if (userSnap.exists() && userSnap.data()?.activeWeddingId) {
      weddingId = userSnap.data().activeWeddingId as string;
    }

    const weddingRef = doc(db, 'weddings', weddingId);
    const weddingSnap = await getDoc(weddingRef);

    if (weddingSnap.exists()) {
      const data = weddingSnap.data() as WeddingWorkspaceData;
      return data;
    }

    // 2. Create new wedding workspace
    const inviteCode = generateCleanInviteCode();
    const newWorkspace: WeddingWorkspaceData = {
      id: weddingId,
      ownerUid: user.uid,
      members: [user.uid],
      inviteCode,
      plannerState: currentState,
      updatedAt: new Date().toISOString(),
    };

    const sanitized = sanitizeForFirestore(newWorkspace);
    await setDoc(weddingRef, sanitized);

    // Save invite code index for fast pairing lookup
    const coupleNames =
      currentState.profile?.brideName && currentState.profile?.groomName
        ? `${currentState.profile.brideName} & ${currentState.profile.groomName}`
        : user.displayName || 'Pasangan Janji Suci';

    const inviteRef = doc(db, 'invite_codes', inviteCode);
    await setDoc(inviteRef, {
      weddingId,
      code: inviteCode,
      createdBy: user.uid,
      coupleNames,
      createdAt: new Date().toISOString(),
    });

    // Save active wedding ID to user profile
    await setDoc(
      userRef,
      {
        activeWeddingId: weddingId,
        email: user.email,
        displayName: user.displayName,
      },
      { merge: true }
    );

    return newWorkspace;
  } catch (error) {
    console.error('[Collab] Failed to initialize wedding workspace:', error);
    throw error;
  }
}

export async function joinWeddingByCode(
  user: AuthUser,
  code: string
): Promise<WeddingWorkspaceData> {
  if (!db) throw new Error('Firebase database belum terhubung.');

  const normalizedCode = code.trim().toUpperCase();
  const inviteRef = doc(db, 'invite_codes', normalizedCode);
  const inviteSnap = await getDoc(inviteRef);

  if (!inviteSnap.exists()) {
    throw new Error('Kode pasangan tidak valid atau tidak ditemukan.');
  }

  const { weddingId } = inviteSnap.data() as { weddingId: string };
  const weddingRef = doc(db, 'weddings', weddingId);
  const weddingSnap = await getDoc(weddingRef);

  if (!weddingSnap.exists()) {
    throw new Error('Lembar kerja rencana pernikahan tidak ditemukan.');
  }

  // Add user to wedding members
  await updateDoc(weddingRef, {
    members: arrayUnion(user.uid),
    updatedAt: new Date().toISOString(),
  });

  // Link weddingId to user's profile
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, { activeWeddingId: weddingId }, { merge: true });

  const updatedSnap = await getDoc(weddingRef);
  return updatedSnap.data() as WeddingWorkspaceData;
}

export async function saveWeddingState(
  weddingId: string,
  state: WeddingPlannerState
): Promise<void> {
  if (!db) return;

  try {
    const weddingRef = doc(db, 'weddings', weddingId);
    const sanitizedState = sanitizeForFirestore(state);
    await setDoc(
      weddingRef,
      {
        plannerState: sanitizedState,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('[Collab] Failed to save wedding workspace state:', error);
    throw error;
  }
}

export function subscribeWeddingWorkspace(
  weddingId: string,
  onUpdate: (data: WeddingWorkspaceData) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!db) return () => {};

  const weddingRef = doc(db, 'weddings', weddingId);
  return onSnapshot(
    weddingRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as WeddingWorkspaceData;
        onUpdate(data);
      }
    },
    (err) => {
      console.error('[Collab] Snapshot error on wedding workspace:', err);
      if (onError) onError(err);
    }
  );
}

export interface InviteDetails {
  weddingId: string;
  code: string;
  coupleNames?: string;
  createdBy?: string;
}

export async function peekInviteDetails(code: string): Promise<InviteDetails | null> {
  if (!db) return null;
  try {
    const normalizedCode = code.trim().toUpperCase();
    const inviteRef = doc(db, 'invite_codes', normalizedCode);
    const snap = await getDoc(inviteRef);
    if (!snap.exists()) return null;
    return snap.data() as InviteDetails;
  } catch (err) {
    console.warn('[Collab] Failed to peek invite details:', err);
    return null;
  }
}

