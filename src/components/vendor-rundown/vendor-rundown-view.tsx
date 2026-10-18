import React, { useState } from 'react';
import { Store, Clock, Plus } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { VendorList } from './vendor-list';
import { AddVendorDialog } from './add-vendor-dialog';
import { RundownTimeline } from './rundown-timeline';
import { AddRundownDialog } from './add-rundown-dialog';

export const VendorRundownView: React.FC = () => {
  const {
    state,
    addVendor,
    updateVendorStatus,
    deleteVendor,
    addRundownItem,
    deleteRundownItem,
  } = useWeddingPlanner();
  const { vendors, rundown, profile } = state;

  const [activeSubTab, setActiveSubTab] = useState<'vendor' | 'rundown'>('vendor');
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [isAddRundownOpen, setIsAddRundownOpen] = useState(false);

  return (
    <div data-testid="vendor-rundown-view" className="flex flex-col gap-4 animate-fade-in">
      {/* Sub-tab Pill Switcher */}
      <div className="flex bg-[#F5EFEB] p-1 rounded-xl border border-[#ECE5DE]">
        <button
          type="button"
          data-testid="subtab-vendors"
          onClick={() => setActiveSubTab('vendor')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'vendor'
              ? 'bg-white text-[#3A302C] shadow-sm'
              : 'text-[#73635C] hover:text-[#3A302C]'
          }`}
        >
          <Store className="w-3.5 h-3.5 text-[#58755E]" strokeWidth={1.75} />
          <span>Rekanan Vendor ({vendors.length})</span>
        </button>

        <button
          type="button"
          data-testid="subtab-rundown"
          onClick={() => setActiveSubTab('rundown')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'rundown'
              ? 'bg-white text-[#3A302C] shadow-sm'
              : 'text-[#73635C] hover:text-[#3A302C]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#B86B70]" strokeWidth={1.75} />
          <span>Rundown Hari-H ({rundown.length})</span>
        </button>
      </div>

      {/* Action Header */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-[#73635C] font-medium">
          {activeSubTab === 'vendor' ? 'Direktori Mitra Vendor' : 'Linimasa Acara'}
        </span>

        {activeSubTab === 'vendor' ? (
          <button
            type="button"
            data-testid="button-open-add-vendor"
            onClick={() => setIsAddVendorOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#58755E] hover:bg-[#4b6350] text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Tambah Vendor</span>
          </button>
        ) : (
          <button
            type="button"
            data-testid="button-open-add-rundown"
            onClick={() => setIsAddRundownOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B86B70] hover:bg-[#a65d62] text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Tambah Sesi</span>
          </button>
        )}
      </div>

      {/* Active SubTab Content */}
      {activeSubTab === 'vendor' ? (
        <VendorList
          vendors={vendors}
          onUpdateStatus={updateVendorStatus}
          onDelete={deleteVendor}
          onOpenAdd={() => setIsAddVendorOpen(true)}
        />
      ) : (
        <RundownTimeline
          rundown={rundown}
          profile={profile}
          onDelete={deleteRundownItem}
          onOpenAdd={() => setIsAddRundownOpen(true)}
        />
      )}

      {/* Modals */}
      <AddVendorDialog
        isOpen={isAddVendorOpen}
        onClose={() => setIsAddVendorOpen(false)}
        onAdd={addVendor}
      />

      <AddRundownDialog
        isOpen={isAddRundownOpen}
        onClose={() => setIsAddRundownOpen(false)}
        onAdd={addRundownItem}
      />
    </div>
  );
};
