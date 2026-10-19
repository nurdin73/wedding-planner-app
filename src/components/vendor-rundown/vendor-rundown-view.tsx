import React, { useState } from 'react';
import { Store, Clock, Plus } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { VendorList } from './vendor-list';
import { VendorDialog } from './vendor-dialog';
import { RundownTimeline } from './rundown-timeline';
import { RundownDialog } from './rundown-dialog';
import { ConfirmDialog } from '../ui/confirm-dialog';
import type { VendorItem, RundownItem } from '../../types/wedding.types';

export const VendorRundownView: React.FC = () => {
  const {
    state,
    addVendor,
    updateVendor,
    updateVendorStatus,
    deleteVendor,
    addRundownItem,
    updateRundownItem,
    deleteRundownItem,
  } = useWeddingPlanner();
  const { vendors, rundown, profile } = state;

  const [activeSubTab, setActiveSubTab] = useState<'vendor' | 'rundown'>('vendor');
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [isAddRundownOpen, setIsAddRundownOpen] = useState(false);
  const [vendorToEdit, setVendorToEdit] = useState<VendorItem | null>(null);
  const [rundownToEdit, setRundownToEdit] = useState<RundownItem | null>(null);
  const [vendorToDelete, setVendorToDelete] = useState<VendorItem | null>(null);
  const [rundownToDelete, setRundownToDelete] = useState<RundownItem | null>(null);

  const handleOpenAddVendor = () => {
    setVendorToEdit(null);
    setIsAddVendorOpen(true);
  };

  const handleOpenEditVendor = (vendor: VendorItem) => {
    setVendorToEdit(vendor);
    setIsAddVendorOpen(true);
  };

  const handleCloseVendorDialog = () => {
    setIsAddVendorOpen(false);
    setVendorToEdit(null);
  };

  const handleOpenAddRundown = () => {
    setRundownToEdit(null);
    setIsAddRundownOpen(true);
  };

  const handleOpenEditRundown = (item: RundownItem) => {
    setRundownToEdit(item);
    setIsAddRundownOpen(true);
  };

  const handleCloseRundownDialog = () => {
    setIsAddRundownOpen(false);
    setRundownToEdit(null);
  };

  const handleDeleteVendorClick = (id: string) => {
    const target = vendors.find((v) => v.id === id);
    if (target) setVendorToDelete(target);
  };

  const handleDeleteRundownClick = (id: string) => {
    const target = rundown.find((r) => r.id === id);
    if (target) setRundownToDelete(target);
  };

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
          <Store className="w-3.5 h-3.5 text-primary" strokeWidth={1.75} />
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
          <Clock className="w-3.5 h-3.5 text-secondary" strokeWidth={1.75} />
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
            onClick={handleOpenAddVendor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Tambah Vendor</span>
          </button>
        ) : (
          <button
            type="button"
            data-testid="button-open-add-rundown"
            onClick={handleOpenAddRundown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
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
          onDelete={handleDeleteVendorClick}
          onEdit={handleOpenEditVendor}
          onOpenAdd={handleOpenAddVendor}
        />
      ) : (
        <RundownTimeline
          rundown={rundown}
          profile={profile}
          onDelete={handleDeleteRundownClick}
          onEdit={handleOpenEditRundown}
          onOpenAdd={handleOpenAddRundown}
        />
      )}

      {/* Modals */}
      <VendorDialog
        isOpen={isAddVendorOpen}
        onClose={handleCloseVendorDialog}
        onAdd={addVendor}
        onUpdate={updateVendor}
        vendorToEdit={vendorToEdit}
      />

      <RundownDialog
        isOpen={isAddRundownOpen}
        onClose={handleCloseRundownDialog}
        onAdd={addRundownItem}
        onUpdate={updateRundownItem}
        rundownToEdit={rundownToEdit}
      />

      {/* Delete Vendor Confirmation Modal */}
      <ConfirmDialog
        isOpen={vendorToDelete !== null}
        title="Hapus Rekanan Vendor?"
        description="Vendor ini akan dihapus dari daftar mitra pernikahan Anda."
        itemName={vendorToDelete?.name}
        confirmLabel="Hapus Vendor"
        cancelLabel="Batal"
        testIdPrefix="confirm-delete-vendor"
        onConfirm={() => {
          if (vendorToDelete) {
            deleteVendor(vendorToDelete.id);
            setVendorToDelete(null);
          }
        }}
        onClose={() => setVendorToDelete(null)}
      />

      {/* Delete Rundown Item Confirmation Modal */}
      <ConfirmDialog
        isOpen={rundownToDelete !== null}
        title="Hapus Sesi Acara?"
        description="Sesi acara ini akan dihapus dari susunan rundown hari-H Anda."
        itemName={rundownToDelete ? `${rundownToDelete.time} - ${rundownToDelete.activity}` : undefined}
        confirmLabel="Hapus Sesi"
        cancelLabel="Batal"
        testIdPrefix="confirm-delete-rundown"
        onConfirm={() => {
          if (rundownToDelete) {
            deleteRundownItem(rundownToDelete.id);
            setRundownToDelete(null);
          }
        }}
        onClose={() => setRundownToDelete(null)}
      />
    </div>
  );
};
