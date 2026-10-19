import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  testIdPrefix?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  itemName,
  confirmLabel = 'Hapus',
  cancelLabel = 'Batal',
  variant = 'danger',
  testIdPrefix = 'confirm-dialog',
  onConfirm,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div
      data-testid={`${testIdPrefix}-backdrop`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A302C]/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        data-testid={`${testIdPrefix}-modal`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${testIdPrefix}-title`}
        aria-describedby={`${testIdPrefix}-desc`}
        className="relative w-full max-w-sm bg-white rounded-2xl p-5 border border-[#ECE5DE] shadow-ambient overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with icon & close */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              data-testid={`${testIdPrefix}-icon`}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isDanger
                  ? 'bg-[#FDF0EE] text-[#B86B70] border-[#F2DFDC]'
                  : 'bg-[#FAF8F5] text-[#58755E] border-[#ECE5DE]'
              }`}
            >
              {isDanger ? (
                <Trash2 className="w-5 h-5" strokeWidth={1.75} />
              ) : (
                <AlertTriangle className="w-5 h-5" strokeWidth={1.75} />
              )}
            </div>
            <div>
              <h3
                id={`${testIdPrefix}-title`}
                data-testid={`${testIdPrefix}-title`}
                className="font-serif text-lg font-semibold text-[#3A302C] leading-snug"
              >
                {title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            data-testid={`${testIdPrefix}-button-close`}
            onClick={onClose}
            className="p-1 rounded-md text-[#A89B95] hover:text-[#3A302C] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
            aria-label="Tutup dialog"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Description body */}
        <p
          id={`${testIdPrefix}-desc`}
          data-testid={`${testIdPrefix}-description`}
          className="text-xs text-[#73635C] leading-relaxed mb-3"
        >
          {description}
        </p>

        {/* Item preview if provided */}
        {itemName && (
          <div
            data-testid={`${testIdPrefix}-item-name`}
            className="mb-5 p-3 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE] text-xs font-medium text-[#3A302C] break-words line-clamp-3 [overflow-wrap:anywhere]"
          >
            "{itemName}"
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            data-testid={`${testIdPrefix}-button-cancel`}
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#ECE5DE] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#73635C] transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            data-testid={`${testIdPrefix}-button-confirm`}
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-xl text-white text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
              isDanger
                ? 'bg-[#B86B70] hover:bg-[#A65D62]'
                : 'bg-[#58755E] hover:bg-[#4B6350]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
