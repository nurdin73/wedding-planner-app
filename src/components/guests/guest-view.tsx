import React, { useState, useMemo } from 'react';
import { UserPlus, Users, Search } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { GuestSummary } from './guest-summary';
import { GuestItem } from './guest-item';
import { AddGuestDialog } from './add-guest-dialog';

export const GuestView: React.FC = () => {
  const { state, addGuest, toggleInvitationStatus, deleteGuest } = useWeddingPlanner();
  const { guests } = state;

  const [filterType, setFilterType] = useState<'ALL' | 'BRIDE' | 'GROOM' | 'VIP'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      // Filter tab
      if (filterType === 'BRIDE' && guest.side !== 'BRIDE' && guest.side !== 'BOTH') return false;
      if (filterType === 'GROOM' && guest.side !== 'GROOM' && guest.side !== 'BOTH') return false;
      if (filterType === 'VIP' && guest.category !== 'VIP') return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          guest.name.toLowerCase().includes(query) ||
          guest.notes?.toLowerCase().includes(query) ||
          guest.contactInfo?.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [guests, filterType, searchQuery]);

  return (
    <div data-testid="guest-view" className="flex flex-col gap-4 animate-fade-in">
      <GuestSummary guests={guests} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <input
            data-testid="input-search-guest"
            type="text"
            placeholder="Cari nama tamu / keluarga..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-[#ECE5DE] text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-[#B86B70] shadow-sm"
          />
          <Search className="w-3.5 h-3.5 text-[#A89B95] absolute left-3 top-2.5 pointer-events-none" strokeWidth={1.75} />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'ALL', label: 'Semua Undangan' },
            { id: 'BRIDE', label: 'Pihak Wanita' },
            { id: 'GROOM', label: 'Pihak Pria' },
            { id: 'VIP', label: 'Kategori VIP' },
          ].map((pill) => {
            const isActive = filterType === pill.id;
            return (
              <button
                key={pill.id}
                data-testid={`filter-guest-${pill.id}`}
                onClick={() => setFilterType(pill.id as typeof filterType)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#B86B70] text-white border-[#B86B70] shadow-sm font-medium'
                    : 'bg-white text-[#73635C] border-[#ECE5DE] hover:border-[#B86B70]/40'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Header and Add Button */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-[#73635C] font-medium">
          Daftar Undangan ({filteredGuests.length})
        </span>
        <button
          type="button"
          data-testid="button-open-add-guest"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B86B70] hover:bg-[#a65d62] text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" strokeWidth={2} />
          <span>Tambah Tamu</span>
        </button>
      </div>

      {/* Guests List or Empty State */}
      {filteredGuests.length === 0 ? (
        <div
          data-testid="guest-empty-state"
          className="bg-white rounded-2xl p-8 border border-[#ECE5DE] text-center flex flex-col items-center justify-center shadow-ambient"
        >
          <div className="w-12 h-12 rounded-full bg-[#FAF5E8] flex items-center justify-center text-[#DFB15B] mb-3">
            <Users className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <h4 className="font-serif text-base font-semibold text-[#3A302C]">
            {searchQuery ? 'Tamu Tidak Ditemukan' : 'Belum Ada Tamu Undangan'}
          </h4>
          <p className="text-xs text-[#73635C] mt-1 max-w-[220px] leading-relaxed">
            {searchQuery
              ? 'Coba gunakan kata kunci pencarian yang lain.'
              : 'Susun daftar undangan dan alokasikan porsi katering agar persiapan lebih terukur.'}
          </p>
          {!searchQuery && (
            <button
              type="button"
              data-testid="button-empty-add-guest"
              onClick={() => setIsAddOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F5EFEB] border border-[#ECE5DE] text-xs font-medium text-[#3A302C] transition-colors cursor-pointer"
            >
              + Catat Tamu Pertama
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredGuests.map((guest) => (
            <GuestItem
              key={guest.id}
              guest={guest}
              onToggleStatus={toggleInvitationStatus}
              onDelete={deleteGuest}
            />
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <AddGuestDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={addGuest}
      />
    </div>
  );
};
