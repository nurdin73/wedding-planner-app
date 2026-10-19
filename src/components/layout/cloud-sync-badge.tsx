import React from 'react';
import { Cloud, CloudCheck, RefreshCw, CloudOff, WifiOff } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { useAuth } from '../../hooks/use-auth';

export const CloudSyncBadge: React.FC = () => {
  const { syncStatus, lastSyncedAt } = useWeddingPlanner();
  const { user } = useAuth();

  // If user is not logged in, data is saved locally
  if (!user) {
    return (
      <div
        data-testid="cloud-sync-badge"
        className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#ECE5DE] text-[10px] text-[#A89B95]"
        title="Data tersimpan di browser ini saja (Masuk untuk menyimpan ke Cloud)"
      >
        <Cloud className="w-3 h-3 text-[#A89B95]" />
        <span>Lokal</span>
      </div>
    );
  }

  if (syncStatus === 'offline') {
    return (
      <div
        data-testid="cloud-sync-badge"
        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAF8F5] border border-[#D5CBC2] text-[10px] text-[#786B64]"
        title="Offline: Perubahan tersimpan di perangkat ini dan akan otomatis disinkronkan saat online kembali."
      >
        <WifiOff className="w-3 h-3 text-[#8C7E77]" />
        <span className="hidden sm:inline">Offline (Lokal)</span>
      </div>
    );
  }

  if (syncStatus === 'syncing') {
    return (
      <div
        data-testid="cloud-sync-badge"
        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] text-amber-700 animate-pulse"
        title="Menyimpan perubahan ke Firebase..."
      >
        <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
        <span className="hidden sm:inline">Menyimpan...</span>
      </div>
    );
  }

  if (syncStatus === 'error') {
    return (
      <div
        data-testid="cloud-sync-badge"
        className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-[10px] text-rose-700"
        title="Gagal menyinkronkan dengan cloud. Pastikan Cloud Firestore sudah diaktifkan di Firebase Console."
      >
        <CloudOff className="w-3 h-3 text-rose-600" />
        <span className="hidden sm:inline">Gagal Sync</span>
      </div>
    );
  }

  return (
    <div
      data-testid="cloud-sync-badge"
      className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50/80 border border-emerald-200 text-[10px] text-emerald-700"
      title={lastSyncedAt ? `Tersimpan di Cloud pukul ${lastSyncedAt}` : 'Tersimpan di Cloud'}
    >
      <CloudCheck className="w-3 h-3 text-emerald-600" />
      <span className="hidden sm:inline">Tersimpan</span>
    </div>
  );
};
