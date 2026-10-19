import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { VendorCategory, VendorStatus, VendorItem } from '../../types/wedding.types';
import { VENDOR_CATEGORY_OPTIONS, VENDOR_STATUS_OPTIONS } from '../../constants/wedding.constants';
import { vendorFormSchema } from '../../schemas/wedding-forms.schema';
import { MaskedCurrencyInput } from '../ui/masked-currency-input';
import { unmaskCurrency, maskCurrency, maskPhoneNumber } from '../../utils/mask.utils';

interface VendorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    name: string,
    category: VendorCategory,
    cost: number,
    status: VendorStatus,
    whatsapp?: string,
    instagram?: string,
    notes?: string
  ) => void;
  onUpdate?: (id: string, updates: Partial<Omit<VendorItem, 'id' | 'createdAt'>>) => void;
  vendorToEdit?: VendorItem | null;
}

const VendorDialogForm: React.FC<VendorDialogProps> = ({
  onClose,
  onAdd,
  onUpdate,
  vendorToEdit,
}) => {
  const [name, setName] = useState(vendorToEdit?.name ?? '');
  const [category, setCategory] = useState<VendorCategory>(vendorToEdit?.category ?? 'VENUE');
  const [costStr, setCostStr] = useState(
    vendorToEdit && vendorToEdit.cost > 0 ? maskCurrency(vendorToEdit.cost) : ''
  );
  const [status, setStatus] = useState<VendorStatus>(vendorToEdit?.status ?? 'CONTACTED');
  const [whatsapp, setWhatsapp] = useState(vendorToEdit?.whatsapp ?? '');
  const [instagram, setInstagram] = useState(vendorToEdit?.instagram ?? '');
  const [notes, setNotes] = useState(vendorToEdit?.notes ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numericCost = unmaskCurrency(costStr);
    const result = vendorFormSchema.safeParse({
      name,
      category,
      cost: numericCost,
      status,
      whatsapp,
      instagram,
      notes,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    if (vendorToEdit && onUpdate) {
      onUpdate(vendorToEdit.id, {
        name: result.data.name,
        category: result.data.category,
        cost: result.data.cost,
        status: result.data.status,
        whatsapp: result.data.whatsapp?.trim() || undefined,
        instagram: result.data.instagram?.trim() || undefined,
        notes: result.data.notes?.trim() || undefined,
      });
    } else {
      onAdd(
        result.data.name,
        result.data.category,
        result.data.cost,
        result.data.status,
        result.data.whatsapp?.trim() || undefined,
        result.data.instagram?.trim() || undefined,
        result.data.notes?.trim() || undefined
      );
    }

    setName('');
    setCostStr('');
    setWhatsapp('');
    setInstagram('');
    setNotes('');
    onClose();
  };

  return (
    <div
      data-testid="vendor-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A302C]/40 backdrop-blur-sm"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-[#ECE5DE] shadow-ambient">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-semibold text-[#3A302C]">
            {vendorToEdit ? 'Edit Rekanan Vendor' : 'Tambah Rekanan Vendor'}
          </h3>
          <button
            type="button"
            data-testid="button-close-add-vendor"
            onClick={onClose}
            className="text-[#A89B95] hover:text-[#3A302C] p-1 rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Nama Vendor / Brand
            </label>
            <input
              data-testid="input-vendor-name"
              type="text"
              placeholder="cth: Lumina Photography"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              className={`w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border text-[#3A302C] placeholder-[#A89B95] focus:outline-none ${
                errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-[#ECE5DE] focus:border-[#B86B70]'
              }`}
              autoFocus
            />
            {errors.name && (
              <p data-testid="error-vendor-name" className="text-[11px] text-rose-600 mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-medium text-[#73635C] mb-1">
                Kategori
              </label>
              <select
                data-testid="select-vendor-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as VendorCategory)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] focus:outline-none focus:border-[#B86B70]"
              >
                {VENDOR_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#73635C] mb-1">
                Status Kontrak
              </label>
              <select
                data-testid="select-vendor-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as VendorStatus)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] focus:outline-none focus:border-[#B86B70]"
              >
                {VENDOR_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Biaya / Kontrak
            </label>
            <MaskedCurrencyInput
              dataTestId="input-vendor-cost"
              placeholder="cth: 15.000.000"
              value={costStr}
              onChange={(masked) => setCostStr(masked)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-medium text-[#73635C] mb-1">
                WhatsApp
              </label>
              <input
                data-testid="input-vendor-whatsapp"
                type="text"
                placeholder="cth: 0812-3456-7890"
                value={whatsapp}
                onChange={(e) => setWhatsapp(maskPhoneNumber(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-[#B86B70] tabular-nums"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#73635C] mb-1">
                Instagram (@)
              </label>
              <input
                data-testid="input-vendor-instagram"
                type="text"
                placeholder="cth: luminaphoto"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-[#B86B70]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#73635C] mb-1">
              Catatan Khusus (opsional)
            </label>
            <input
              data-testid="input-vendor-notes"
              type="text"
              placeholder="cth: Termasuk album cetak 20 halaman & video teaser"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[#FAF8F5] border border-[#ECE5DE] text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-[#B86B70]"
            />
          </div>

          <div className="flex gap-2.5 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-[#ECE5DE] text-xs font-medium text-[#73635C] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              data-testid="button-submit-vendor"
              type="submit"
              className="flex-1 py-2 rounded-xl bg-[#58755E] hover:bg-[#4b6350] text-xs font-medium text-white transition-colors cursor-pointer shadow-sm"
            >
              {vendorToEdit ? 'Simpan Perubahan' : 'Simpan Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const VendorDialog: React.FC<VendorDialogProps> = (props) => {
  if (!props.isOpen) return null;
  return <VendorDialogForm key={props.vendorToEdit?.id ?? 'create'} {...props} />;
};

export const AddVendorDialog = VendorDialog;


