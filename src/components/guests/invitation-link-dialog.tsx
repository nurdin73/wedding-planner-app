import React, { useState } from 'react';
import { X, Globe, ExternalLink, Check, Info } from 'lucide-react';
import { invitationUrlSchema } from '../../schemas/wedding-forms.schema';

interface InvitationLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl?: string;
  onSave: (url: string | undefined) => void;
}

const InvitationLinkForm: React.FC<Omit<InvitationLinkDialogProps, 'isOpen'>> = ({
  onClose,
  currentUrl = '',
  onSave,
}) => {
  const [url, setUrl] = useState(currentUrl);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();

    if (!trimmed) {
      onSave(undefined);
      setSaved(true);
      setTimeout(() => onClose(), 400);
      return;
    }

    const result = invitationUrlSchema.safeParse({ invitationUrl: trimmed });
    if (!result.success) {
      const issue = result.error.issues[0];
      setError(issue ? issue.message : 'Format URL tidak valid');
      return;
    }

    setError(null);
    onSave(trimmed);
    setSaved(true);
    setTimeout(() => onClose(), 400);
  };

  const previewSampleUrl = url.trim()
    ? `${url.trim()}${url.includes('?') ? '&' : '?'}to=Budi+Santoso`
    : null;

  return (
    <div
      data-testid="modal-invitation-link-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        data-testid="modal-invitation-link"
        className="relative w-full max-w-md bg-stone-50 rounded-2xl shadow-xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Globe className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="font-serif text-sm font-semibold text-[#3A302C]">
                Tautan Undangan Online Acara
              </h3>
              <p className="text-[11px] text-[#A89B95]">
                Platform eksternal (Viding, Satumomen, Our-Wedding, dll.)
              </p>
            </div>
          </div>
          <button
            type="button"
            data-testid="button-close-invitation-link-dialog"
            onClick={onClose}
            className="p-1 rounded-lg text-[#A89B95] hover:text-[#3A302C] hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#3A302C]">
              Tautan Website Undangan (Base URL)
            </label>
            <input
              type="url"
              data-testid="input-invitation-base-url"
              placeholder="https://satumomen.com/sarah-david"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError(null);
              }}
              className={`w-full px-3 py-2 text-xs rounded-xl bg-white border ${
                error ? 'border-red-500' : 'border-[#ECE5DE]'
              } text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-secondary shadow-sm`}
            />
            {error && (
              <span data-testid="error-invitation-url" className="text-[11px] text-red-600">
                {error}
              </span>
            )}
          </div>

          {/* Explanation Info */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-2.5 text-[11px] text-[#73635C] leading-relaxed">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <p className="font-medium text-[#3A302C]">Personalisasi Otomatis per Tamu</p>
              <p className="mt-0.5">
                Setiap kali Anda menekan tombol <strong>Kirim WA</strong> pada tamu, sistem akan otomatis menambahkan parameter nama tamu (misal: <code className="text-amber-800 bg-white/70 px-1 py-0.5 rounded">?to=Nama+Tamu</code>).
              </p>
            </div>
          </div>

          {/* Preview URL */}
          {previewSampleUrl && (
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE] text-[11px]">
              <span className="block text-[10px] text-[#A89B95] uppercase tracking-wider font-semibold">
                Contoh Tautan Tamu:
              </span>
              <a
                href={previewSampleUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-1 text-secondary font-medium break-all flex items-center gap-1 hover:underline"
              >
                <span>{previewSampleUrl}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-200">
            {currentUrl ? (
              <button
                type="button"
                data-testid="button-clear-invitation-url"
                onClick={() => {
                  setUrl('');
                  onSave(undefined);
                  setSaved(true);
                  setTimeout(() => onClose(), 400);
                }}
                className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1.5 transition-colors cursor-pointer"
              >
                Hapus Tautan
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                data-testid="button-cancel-invitation-url"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#ECE5DE] text-xs font-medium text-[#73635C] hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                data-testid="button-save-invitation-url"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
              >
                {saved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                    <span>Tersimpan</span>
                  </>
                ) : (
                  <span>Simpan Tautan</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export const InvitationLinkDialog: React.FC<InvitationLinkDialogProps> = (props) => {
  if (!props.isOpen) return null;
  return <InvitationLinkForm key={props.currentUrl ?? 'new'} {...props} />;
};
