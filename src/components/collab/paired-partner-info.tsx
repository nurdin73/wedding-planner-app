import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  CheckCircle2,
  Calendar,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';
import type { AuthUser } from '../../types/auth.types';
import type { WeddingPlannerState, WorkspaceMemberInfo } from '../../types/wedding.types';

interface PairedPartnerInfoProps {
  user: AuthUser | null;
  membersInfo?: WorkspaceMemberInfo[];
  plannerState: WeddingPlannerState;
  weddingId: string | null;
  inviteCode: string | null;
  lastSyncedAt: string | null;
  onClose: () => void;
}

export const PairedPartnerInfo: React.FC<PairedPartnerInfoProps> = ({
  user,
  membersInfo = [],
  plannerState,
  inviteCode,
  lastSyncedAt,
  onClose,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  // Identify partner from membersInfo (member whose uid !== current user uid)
  const partnerMember = membersInfo.find((m) => m.uid !== user?.uid);

  // Fallback names from wedding profile if member info is still loading
  const { brideName, groomName, weddingDate } = plannerState.profile;
  const coupleTitle =
    brideName && groomName ? `${groomName} & ${brideName}` : 'Rencana Pernikahan Berdua';

  const partnerDisplayName =
    partnerMember?.displayName ||
    partnerMember?.email?.split('@')[0] ||
    (groomName && user?.displayName?.toLowerCase().includes(groomName.toLowerCase())
      ? brideName || 'Pasangan Tercinta'
      : groomName || 'Pasangan Tercinta');

  const partnerEmail = partnerMember?.email;
  const partnerPhoto = partnerMember?.photoURL;

  const handleCopyCode = async () => {
    if (!inviteCode) return;
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return 'PS';
  };

  return (
    <div data-testid="collab-paired-container" className="space-y-5">
      {/* Connected Couple Avatars Card */}
      <div
        data-testid="collab-paired-card"
        className="relative overflow-hidden bg-gradient-to-br from-rose-50/70 via-stone-50 to-amber-50/40 rounded-2xl p-5 border border-rose-200/80 shadow-sm"
      >
        <div className="flex items-center justify-between gap-3">
          {/* User Profile */}
          <div data-testid="collab-paired-user" className="flex flex-col items-center flex-1 text-center">
            <div className="relative mb-2">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Anda'}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-rose-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-800 border-2 border-white shadow-sm ring-2 ring-rose-200 flex items-center justify-center font-bold text-base">
                  {getInitials(user?.displayName, user?.email)}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white" />
            </div>
            <p className="text-xs font-semibold text-stone-800 max-w-[120px] truncate">
              {user?.displayName || 'Anda'}
            </p>
            <span className="inline-block px-2 py-0.5 mt-1 rounded-full text-[10px] font-medium bg-rose-100 text-rose-700">
              Anda
            </span>
          </div>

          {/* Linking Heart Indicator */}
          <div className="flex flex-col items-center shrink-0 px-1">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white border border-rose-200 shadow-sm">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
              <Sparkles className="w-3 h-3 text-amber-500 absolute -top-1 -right-1" />
            </div>
            <span className="text-[10px] font-semibold text-rose-700 mt-1 whitespace-nowrap">
              Terhubung 💕
            </span>
          </div>

          {/* Partner Profile */}
          <div data-testid="collab-paired-partner" className="flex flex-col items-center flex-1 text-center">
            <div className="relative mb-2">
              {partnerPhoto ? (
                <img
                  src={partnerPhoto}
                  alt={partnerDisplayName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-rose-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 border-2 border-white shadow-sm ring-2 ring-amber-200 flex items-center justify-center font-bold text-base">
                  {getInitials(partnerDisplayName, partnerEmail)}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white" />
            </div>
            <p className="text-xs font-semibold text-stone-800 max-w-[120px] truncate" title={partnerDisplayName}>
              {partnerDisplayName}
            </p>
            <span className="inline-block px-2 py-0.5 mt-1 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800">
              Pasangan
            </span>
          </div>
        </div>

        {partnerEmail && (
          <p className="text-center text-[11px] text-stone-500 mt-3 border-t border-rose-100 pt-2 font-mono">
            {partnerEmail}
          </p>
        )}
      </div>

      {/* Sync Status Banner */}
      <div
        data-testid="collab-sync-status-card"
        className="flex items-center justify-between p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-900"
      >
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-semibold">Sinkronisasi Realtime Aktif</p>
            <p className="text-[11px] text-emerald-700">
              Tersinkron otomatis setiap kali ada perubahan
            </p>
          </div>
        </div>
        {lastSyncedAt && (
          <span className="text-[10px] font-mono bg-white px-2 py-1 rounded-md border border-emerald-200 text-emerald-700">
            {lastSyncedAt}
          </span>
        )}
      </div>

      {/* Shared Wedding Info Card */}
      <div
        data-testid="collab-wedding-info-card"
        className="p-4 rounded-xl bg-white border border-stone-200 space-y-2.5"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-stone-500" />
          <h4 className="font-serif text-sm font-semibold text-stone-800">
            {coupleTitle}
          </h4>
        </div>

        {weddingDate && (
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>
              Hari Bahagia:{' '}
              <strong className="text-stone-800">
                {new Date(weddingDate).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </strong>
            </span>
          </div>
        )}

        <p className="text-xs text-stone-600 leading-relaxed">
          Kalian berdua memiliki akses penuh untuk menambah dan memperbarui daftar tugas (checklist), anggaran belanja, daftar tamu, serta rundown acara secara bersamaan.
        </p>

        {/* Discrete Room Code Info */}
        {inviteCode && (
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>
              Kode Ruang Bersama: <strong className="font-mono text-stone-700">{inviteCode}</strong>
            </span>
            <button
              type="button"
              data-testid="collab-copy-room-id-btn"
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-[11px] text-rose-700 hover:text-rose-800 font-medium cursor-pointer"
            >
              {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copiedCode ? 'Tersalin' : 'Salin Kode'}
            </button>
          </div>
        )}
      </div>

      {/* Done Button */}
      <button
        type="button"
        data-testid="collab-close-paired-btn"
        onClick={onClose}
        className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm transition-all shadow-sm active:scale-[0.99] cursor-pointer"
      >
        Tutup & Lanjut Merencanakan
      </button>
    </div>
  );
};
