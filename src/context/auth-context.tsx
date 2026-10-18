import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  type User,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';
import type { AuthContextType, AuthUser, AuthStatus } from '../types/auth.types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapFirebaseUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setStatus('unauthenticated');
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
          setUser(mapFirebaseUser(firebaseUser));
          setStatus('authenticated');
        } else {
          setUser(null);
          setStatus('unauthenticated');
        }
      },
      (authError) => {
        console.error('[Firebase Auth Error]', authError);
        setError(authError.message);
        setStatus('unauthenticated');
      }
    );

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    if (!isFirebaseConfigured || !auth) {
      setError('Firebase belum dikonfigurasi. Isi kredensial di file .env terlebih dahulu.');
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      const errCode = (err as { code?: string })?.code;
      if (errCode === 'auth/unauthorized-domain') {
        setError('Domain localhost belum diizinkan di Firebase Console > Authentication > Settings > Authorized Domains.');
      } else if (errCode === 'auth/popup-closed-by-user') {
        // User closed popup; non-critical
      } else {
        const message = (err as Error)?.message || 'Gagal masuk dengan Google.';
        setError(message);
      }
    }
  }, []);

  const signOutUser = useCallback(async () => {
    setError(null);
    if (!auth) {
      setUser(null);
      setStatus('unauthenticated');
      return;
    }

    try {
      await signOut(auth);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Gagal keluar akun.');
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        isConfigured: isFirebaseConfigured,
        error,
        signInWithGoogle,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
