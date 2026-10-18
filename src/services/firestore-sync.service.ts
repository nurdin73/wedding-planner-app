import { doc, getDoc, setDoc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { WeddingPlannerState } from '../types/wedding.types';

function getPlannerDocRef(uid: string) {
  if (!db) return null;
  return doc(db, 'users', uid, 'planner', 'data');
}

export async function fetchCloudPlanner(uid: string): Promise<WeddingPlannerState | null> {
  const docRef = getPlannerDocRef(uid);
  if (!docRef) return null;

  try {
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as WeddingPlannerState;
    }
    return null;
  } catch (error) {
    console.error('[Firestore] Error fetching planner data:', error);
    throw error;
  }
}

export function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

export async function saveCloudPlanner(uid: string, state: WeddingPlannerState): Promise<void> {
  const docRef = getPlannerDocRef(uid);
  if (!docRef) return;

  try {
    const payload = sanitizeForFirestore({
      ...state,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    console.error('[Firestore] Error saving planner data:', error);
    throw error;
  }
}

export function subscribeCloudPlanner(
  uid: string,
  onUpdate: (state: WeddingPlannerState) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const docRef = getPlannerDocRef(uid);
  if (!docRef) {
    return () => {};
  }

  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as WeddingPlannerState;
        onUpdate(data);
      }
    },
    (error) => {
      console.error('[Firestore] Snapshot listener error:', error);
      if (onError) onError(error);
    }
  );
}
