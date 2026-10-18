import React, { useState, useRef, useEffect } from 'react';
import { LogOut, AlertCircle, Loader2, Heart, CloudCheck, CloudOff, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/use-auth';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';

interface UserAuthButtonProps {
  onOpenInvite?: () => void;
}

export const UserAuthButton: React.FC<UserAuthButtonProps> = ({ onOpenInvite }) => {
  const { user, status, isConfigured, error, signInWithGoogle, signOutUser } = useAuth();
  const { syncStatus, lastSyncedAt, isPaired } = useWeddingPlanner();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (status === 'loading') {
    return (
      <div
        data-testid="auth-loading-indicator"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#ECE5DE] text-xs text-[#73635C]"
      >
        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B86B70]" />
        <span>Memuat...</span>
      </div>
    );
  }

  if (status === 'authenticated' && user) {
    const initials = (user.displayName || user.email || 'U').slice(0, 2).toUpperCase();

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          data-testid="button-auth-profile"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#ECE5DE] text-xs text-[#3A302C] shadow-sm cursor-pointer transition-colors"
          title={user.displayName || user.email || 'Profil Akun'}
        >
          <div className="relative">
            {user.photoURL ? (
              <img
                data-testid="auth-user-avatar"
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-5 h-5 rounded-full object-cover border border-[#ECE5DE]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                data-testid="auth-user-initials"
                className="w-5 h-5 rounded-full bg-[#FDF0EE] text-[#B86B70] text-[10px] font-semibold flex items-center justify-center border border-[#F2DFDC]"
              >
                {initials}
              </div>
            )}
            {/* Sync Status Dot */}
            <span
              data-testid="auth-sync-dot"
              className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${
                syncStatus === 'syncing'
                  ? 'bg-amber-400 animate-pulse'
                  : syncStatus === 'error'
                  ? 'bg-rose-500'
                  : 'bg-emerald-500'
              }`}
              title={syncStatus === 'saved' ? 'Tersimpan di Cloud' : syncStatus}
            />
          </div>
          <span className="font-medium max-w-[75px] truncate">
            {user.displayName?.split(' ')[0] || 'Akun'}
          </span>
          {isPaired && <span className="text-[11px]" title="Terhubung berdua">💍</span>}
        </button>

        {isOpen && (
          <div
            data-testid="auth-user-dropdown"
            className="absolute right-0 mt-1.5 w-60 rounded-xl bg-white border border-[#ECE5DE] shadow-lg p-2.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
          >
            {/* User Identity */}
            <div className="px-2 py-1.5 border-b border-[#F2EDE8] mb-2">
              <p className="font-semibold text-[#3A302C] truncate">
                {user.displayName || 'Pengguna Janji Suci'}
              </p>
              <p className="text-[11px] text-[#A89B95] truncate">{user.email}</p>
            </div>

            {/* Cloud Sync Status info */}
            <div
              data-testid="dropdown-sync-status"
              className="px-2 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] mb-2 flex items-center justify-between"
            >
              <div className="flex items-center gap-1.5 text-[11px] text-[#73635C]">
                {syncStatus === 'syncing' ? (
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                ) : syncStatus === 'error' ? (
                  <CloudOff className="w-3.5 h-3.5 text-rose-600" />
                ) : (
                  <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span>
                  {syncStatus === 'syncing'
                    ? 'Menyinkronkan...'
                    : syncStatus === 'error'
                    ? 'Gagal Sinkron'
                    : 'Tersimpan di Cloud'}
                </span>
              </div>
              {lastSyncedAt && <span className="text-[10px] text-[#A89B95]">{lastSyncedAt}</span>}
            </div>

            {/* Partner Collaboration Entry */}
            {onOpenInvite && (
              <button
                type="button"
                data-testid="dropdown-partner-collab-btn"
                onClick={() => {
                  setIsOpen(false);
                  onOpenInvite();
                }}
                className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-rose-50/70 text-stone-700 hover:text-rose-800 transition-colors cursor-pointer mb-2 text-left"
              >
                <div className="flex items-center gap-2">
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isPaired ? 'fill-rose-500 text-rose-500' : 'text-rose-600'
                    }`}
                  />
                  <span className="font-medium text-xs">
                    {isPaired ? 'Ruang Pasangan' : 'Ajak Pasangan'}
                  </span>
                </div>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                    isPaired
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                >
                  {isPaired ? 'Berdua 💕' : 'Hubungkan'}
                </span>
              </button>
            )}

            <button
              type="button"
              data-testid="button-auth-logout"
              onClick={async () => {
                setIsOpen(false);
                await signOutUser();
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-rose-700 hover:bg-rose-50 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  // Unauthenticated state
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        data-testid="button-auth-login"
        onClick={() => {
          if (!isConfigured) {
            setIsOpen((prev) => !prev);
          } else {
            signInWithGoogle();
          }
        }}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#ECE5DE] text-xs font-medium text-[#3A302C] shadow-sm cursor-pointer transition-colors"
        title="Masuk dengan Google"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Masuk</span>
      </button>

      {/* Helper popover when .env is not yet populated */}
      {!isConfigured && isOpen && (
        <div
          data-testid="auth-unconfigured-popover"
          className="absolute right-0 mt-1.5 w-64 rounded-xl bg-white border border-[#ECE5DE] shadow-xl p-3 z-50 text-xs animate-in fade-in zoom-in-95"
        >
          <div className="flex items-start gap-2 text-amber-800 mb-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="font-semibold">Setup Firebase Kredensial</p>
          </div>
          <p className="text-[11px] text-[#73635C] leading-relaxed mb-2">
            Isi file <code className="px-1 py-0.5 bg-[#FAF8F5] rounded border border-[#ECE5DE]">.env</code> dengan kredensial dari Firebase Console untuk mengaktifkan Google Login.
          </p>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full text-center py-1 rounded bg-[#FAF8F5] hover:bg-[#F2EDE8] text-[11px] text-[#3A302C] font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      )}

      {error && (
        <div
          data-testid="auth-error-message"
          className="absolute right-0 mt-1.5 w-64 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 p-2.5 z-50 text-[11px] shadow-lg flex items-start gap-1.5"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Login Gagal</p>
            <p className="mt-0.5 leading-snug">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

