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
import type { WeddingPlannerState, WorkspaceMemberInfo } from '../types/wedding.types';
import { sanitizeForFirestore } from './firestore-sync.service';

export interface WeddingWorkspaceData {
  id: string;
  ownerUid: string;
  members: string[];
  membersInfo?: WorkspaceMemberInfo[];
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

    const currentUserMember: WorkspaceMemberInfo = {
      uid: user.uid,
      displayName: user.displayName || user.email?.split('@')[0] || 'Pasangan',
      email: user.email,
      photoURL: user.photoURL,
      joinedAt: new Date().toISOString(),
    };

    if (weddingSnap.exists()) {
      const data = weddingSnap.data() as WeddingWorkspaceData;
      const existingMembersInfo = data.membersInfo || [];
      const hasCurrent = existingMembersInfo.some((m) => m.uid === user.uid);
      if (!hasCurrent || !data.membersInfo) {
        const updatedMembers = hasCurrent
          ? existingMembersInfo
          : [...existingMembersInfo, currentUserMember];
        try {
          await updateDoc(weddingRef, {
            membersInfo: updatedMembers,
          });
          data.membersInfo = updatedMembers;
        } catch (err) {
          console.warn('[Collab] Could not backfill membersInfo:', err);
        }
      }
      return data;
    }

    // 2. Create new wedding workspace
    const inviteCode = generateCleanInviteCode();
    const newWorkspace: WeddingWorkspaceData = {
      id: weddingId,
      ownerUid: user.uid,
      members: [user.uid],
      membersInfo: [currentUserMember],
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

  // Add user to wedding members directly.
  // We avoid calling getDoc(weddingRef) prior to this because Firestore Security Rules
  // restrict read access strictly to authenticated members of the wedding workspace.
  // By updating members first with arrayUnion, the write succeeds under the rule
  // (request.auth.uid in request.resource.data.members), and subsequent reads succeed.
  const partnerMemberInfo: WorkspaceMemberInfo = {
    uid: user.uid,
    displayName: user.displayName || user.email?.split('@')[0] || 'Pasangan',
    email: user.email,
    photoURL: user.photoURL,
    joinedAt: new Date().toISOString(),
  };

  try {
    await updateDoc(weddingRef, {
      members: arrayUnion(user.uid),
      membersInfo: arrayUnion(partnerMemberInfo),
      updatedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (err?.code === 'not-found') {
      throw new Error('Lembar kerja rencana pernikahan tidak ditemukan.');
    }
    console.error('[Collab] Failed to join wedding members:', error);
    throw error;
  }

  // Link weddingId to user's profile
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, { activeWeddingId: weddingId }, { merge: true });

  const updatedSnap = await getDoc(weddingRef);
  if (!updatedSnap.exists()) {
    throw new Error('Gagal memuat data lembar kerja rencana pernikahan.');
  }
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

