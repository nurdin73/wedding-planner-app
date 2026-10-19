import React from 'react';
import { Store, MessageCircle, Camera, Trash2, Pencil } from 'lucide-react';
import type { VendorItem, VendorStatus } from '../../types/wedding.types';
import { formatRupiah } from '../../utils/currency.utils';
import { VENDOR_CATEGORY_OPTIONS, VENDOR_STATUS_OPTIONS } from '../../constants/wedding.constants';

interface VendorListProps {
  vendors: VendorItem[];
  onUpdateStatus: (id: string, status: VendorStatus) => void;
  onDelete: (id: string) => void;
  onEdit?: (vendor: VendorItem) => void;
  onOpenAdd: () => void;
}

export const VendorList: React.FC<VendorListProps> = ({
  vendors,
  onUpdateStatus,
  onDelete,
  onEdit,
  onOpenAdd,
}) => {
  const getCategoryLabel = (cat: string) => {
    return VENDOR_CATEGORY_OPTIONS.find((c) => c.id === cat)?.label || cat;
  };

  const getStatusColor = (status: VendorStatus) => {
    switch (status) {
      case 'PAID':
      case 'COMPLETED':
        return 'bg-primary-light text-primary border-primary/30';
      case 'DP':
        return 'bg-[#FAF5E8] text-[#DFB15B] border-[#DFB15B]/40';
      default:
        return 'bg-[#FAF8F5] text-[#73635C] border-[#ECE5DE]';
    }
  };

  if (vendors.length === 0) {
    return (
      <div
        data-testid="vendor-empty-state"
        className="bg-white rounded-2xl p-8 border border-[#ECE5DE] text-center flex flex-col items-center justify-center shadow-ambient"
      >
        <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center text-primary mb-3">
          <Store className="w-6 h-6" strokeWidth={1.75} />
        </div>
        <h4 className="font-serif text-base font-semibold text-[#3A302C]">
          Belum Ada Rekanan Vendor
        </h4>
        <p className="text-xs text-[#73635C] mt-1 max-w-[220px] leading-relaxed">
          Kumpulkan kontak vendor gedung, katering, foto, dan MUA dalam satu direktori yang rapi.
        </p>
        <button
          type="button"
          data-testid="button-empty-add-vendor"
          onClick={onOpenAdd}
          className="mt-4 px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F5EFEB] border border-[#ECE5DE] text-xs font-medium text-[#3A302C] transition-colors cursor-pointer"
        >
          + Catat Vendor Pertama
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {vendors.map((vendor) => (
        <div
          key={vendor.id}
          data-testid={`vendor-item-${vendor.id}`}
          className="bg-white p-3.5 rounded-xl border border-[#ECE5DE] shadow-ambient flex flex-col gap-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-[#3A302C] line-clamp-2 break-words [overflow-wrap:anywhere]">
                  {vendor.name}
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#73635C] border border-[#ECE5DE] shrink-0">
                  {getCategoryLabel(vendor.category)}
                </span>
              </div>
              {vendor.cost > 0 && (
                <span className="block text-xs font-semibold text-secondary tabular-nums mt-0.5">
                  {formatRupiah(vendor.cost)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <select
                data-testid={`select-vendor-status-${vendor.id}`}
                value={vendor.status}
                onChange={(e) => onUpdateStatus(vendor.id, e.target.value as VendorStatus)}
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border cursor-pointer focus:outline-none ${getStatusColor(
                  vendor.status
                )}`}
              >
                {VENDOR_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {onEdit && (
                <button
                  type="button"
                  data-testid={`button-edit-vendor-${vendor.id}`}
                  onClick={() => onEdit(vendor)}
                  className="opacity-40 hover:opacity-100 hover:text-primary text-[#A89B95] p-1 rounded-md transition-opacity cursor-pointer"
                  aria-label="Edit vendor"
                >
                  <Pencil className="w-4 h-4" strokeWidth={1.75} />
                </button>
              )}

              <button
                type="button"
                data-testid={`button-delete-vendor-${vendor.id}`}
                onClick={() => onDelete(vendor.id)}
                className="opacity-40 hover:opacity-100 hover:text-secondary text-[#A89B95] p-1 rounded-md transition-opacity cursor-pointer"
                aria-label="Hapus vendor"
              >
                <Trash2 className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          {vendor.notes && (
            <p className="text-[11px] text-[#73635C] bg-[#FAF8F5] p-2 rounded-lg border border-[#ECE5DE]/60 leading-relaxed line-clamp-2 break-words [overflow-wrap:anywhere]">
              {vendor.notes}
            </p>
          )}

          <div className="flex items-center gap-3 pt-1 border-t border-[#ECE5DE]/60 text-[11px]">
            {vendor.whatsapp && (
              <a
                href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>WhatsApp</span>
              </a>
            )}
            {vendor.instagram && (
              <a
                href={`https://instagram.com/${vendor.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-secondary hover:underline"
              >
                <Camera className="w-3.5 h-3.5" strokeWidth={1.75} />
                <span>@{vendor.instagram.replace('@', '')}</span>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
