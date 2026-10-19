import React, { useState } from 'react';
import { X, Globe, ExternalLink, Check, Info } from 'lucide-react';
import { invitationUrlSchema } from '../../schemas/wedding-forms.schema';
import { getPersonalizedInvitationUrl } from '../../utils/invitation.utils';

interface InvitationLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl?: string;
  currentParamKey?: string;
  onSave: (url: string | undefined, paramKey?: string) => void;
}

const PRESET_PARAM_KEYS = [
  { id: 'to', label: '?to= (Satumomen / Standar)' },
  { id: 'u', label: '?u= (Viding)' },
  { id: 'tamu', label: '?tamu=' },
  { id: 'guest', label: '?guest=' },
  { id: 'custom', label: 'Kustom' },
];

const InvitationLinkForm: React.FC<Omit<InvitationLinkDialogProps, 'isOpen'>> = ({
  onClose,
  currentUrl = '',
  currentParamKey = 'to',
  onSave,
}) => {
  const [url, setUrl] = useState(currentUrl);
  const initialIsPreset = ['to', 'u', 'tamu', 'guest'].includes(currentParamKey);
  const [paramKeyType, setParamKeyType] = useState<string>(initialIsPreset ? currentParamKey : 'custom');
  const [customKey, setCustomKey] = useState<string>(initialIsPreset ? '' : currentParamKey);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const effectiveParamKey = paramKeyType === 'custom' ? (customKey.trim() || 'to') : paramKeyType;

  const hasTemplatePlaceholder =
    url.includes('{nama}') || url.includes('{name}') || url.includes('{tamu}') || url.includes('{guest}');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();

    if (!trimmed) {
      onSave(undefined, undefined);
      setSaved(true);
      setTimeout(() => onClose(), 400);
      return;
    }

    // If URL contains placeholder, strip placeholder for zod url validation test
    const testUrl = trimmed
      .replace(/\{nama\}/gi, 'dummy')
      .replace(/\{name\}/gi, 'dummy')
      .replace(/\{tamu\}/gi, 'dummy')
      .replace(/\{guest\}/gi, 'dummy');

    const result = invitationUrlSchema.safeParse({ invitationUrl: testUrl });
    if (!result.success) {
      const issue = result.error.issues[0];
      setError(issue ? issue.message : 'Format URL tidak valid (harus diawali http:// atau https://)');
      return;
    }

    setError(null);
    onSave(trimmed, effectiveParamKey);
    setSaved(true);
    setTimeout(() => onClose(), 400);
  };

  const previewSampleUrl = url.trim()
    ? getPersonalizedInvitationUrl(url.trim(), undefined, 'Budi Santoso', effectiveParamKey)
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
                Dukungan fleksibel untuk semua vendor web undangan
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
              Tautan Website Undangan
            </label>
            <input
              type="text"
              data-testid="input-invitation-base-url"
              placeholder="https://viding.co/sarah-david atau dengan {nama}"
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

          {/* Format Parameter Key Selector (Only shown if no inline template placeholder {nama}) */}
          {!hasTemplatePlaceholder && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#3A302C]">
                Parameter Nama Tamu (Query Param)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_PARAM_KEYS.map((opt) => {
                  const isSelected = paramKeyType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      data-testid={`param-key-${opt.id}`}
                      onClick={() => setParamKeyType(opt.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-secondary text-white border-secondary shadow-xs'
                          : 'bg-white text-[#73635C] border-[#ECE5DE] hover:border-secondary/40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {paramKeyType === 'custom' && (
                <div className="mt-1">
                  <input
                    type="text"
                    data-testid="input-custom-param-key"
                    placeholder="Nama parameter (cth: penerima)"
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-[#ECE5DE] text-[#3A302C] placeholder-[#A89B95] focus:outline-none focus:border-secondary"
                  />
                </div>
              )}
            </div>
          )}

          {/* Explanation Info */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-start gap-2.5 text-[11px] text-[#73635C] leading-relaxed">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" strokeWidth={1.75} />
            <div>
              <p className="font-medium text-[#3A302C]">Fleksibilitas Template</p>
              <p className="mt-0.5">
                {hasTemplatePlaceholder ? (
                  <>
                    Format template <code className="text-amber-900 bg-amber-100/70 px-1 py-0.5 rounded font-mono font-semibold">&#123;nama&#125;</code> terdeteksi. Sistem akan menggantikan token tersebut langsung dengan nama tamu di setiap link WA.
                  </>
                ) : (
                  <>
                    Pilih parameter yang sesuai dengan vendor Anda (misal <strong>u</strong> untuk Viding, <strong>to</strong> untuk Satumomen), atau gunakan placeholder <code className="text-amber-900 bg-amber-100/70 px-1 py-0.5 rounded font-mono">&#123;nama&#125;</code> langsung di dalam URL.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Preview URL */}
          {previewSampleUrl && (
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE] text-[11px]">
              <span className="block text-[10px] text-[#A89B95] uppercase tracking-wider font-semibold">
                Hasil Pratinjau Tautan Tamu:
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
                  onSave(undefined, undefined);
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
  return <InvitationLinkForm key={`${props.currentUrl ?? 'new'}-${props.currentParamKey ?? 'to'}`} {...props} />;
};
