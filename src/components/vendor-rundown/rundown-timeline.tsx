import React, { useState } from 'react';
import { Clock, Copy, Check, Trash2, Milestone, MapPin, UserCheck } from 'lucide-react';
import type { RundownItem, CoupleProfile } from '../../types/wedding.types';
import { formatIndonesianDate } from '../../utils/date.utils';

interface RundownTimelineProps {
  rundown: RundownItem[];
  profile: CoupleProfile;
  onDelete: (id: string) => void;
  onOpenAdd: () => void;
}

export const RundownTimeline: React.FC<RundownTimelineProps> = ({
  rundown,
  profile,
  onDelete,
  onOpenAdd,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyWhatsApp = () => {
    if (rundown.length === 0) return;

    const coupleTitle = `${profile.brideName} & ${profile.groomName}`;
    const dateFormatted = formatIndonesianDate(profile.weddingDate);

    let text = `📋 *SUSUNAN ACARA HARI-H PERNIKAHAN*\n`;
    text += `💍 *${coupleTitle}*\n`;
    if (dateFormatted) text += `📅 ${dateFormatted}\n`;
    text += `──────────────────\n\n`;

    rundown.forEach((item, index) => {
      text += `${index + 1}. ⏰ *${item.time}* — ${item.activity}\n`;
      text += `   • PIC: ${item.pic}\n`;
      if (item.location) text += `   • Lokasi: ${item.location}\n`;
      if (item.notes) text += `   • Catatan: ${item.notes}\n`;
      text += `\n`;
    });

    text += `_Disusun rapi melalui Janji Suci Planner_`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (rundown.length === 0) {
    return (
      <div
        data-testid="rundown-empty-state"
        className="bg-white rounded-2xl p-8 border border-[#ECE5DE] text-center flex flex-col items-center justify-center shadow-ambient"
      >
        <div className="w-12 h-12 rounded-full bg-[#FAF5E8] flex items-center justify-center text-[#DFB15B] mb-3">
          <Clock className="w-6 h-6" strokeWidth={1.75} />
        </div>
        <h4 className="font-serif text-base font-semibold text-[#3A302C]">
          Belum Ada Susunan Acara
        </h4>
        <p className="text-xs text-[#73635C] mt-1 max-w-[220px] leading-relaxed">
          Atur linimasa jam demi jam dan penanggung jawab (PIC) untuk kelancaran Hari-H pernikahan.
        </p>
        <button
          type="button"
          data-testid="button-empty-add-rundown"
          onClick={onOpenAdd}
          className="mt-4 px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F5EFEB] border border-[#ECE5DE] text-xs font-medium text-[#3A302C] transition-colors cursor-pointer"
        >
          + Buat Sesi Acara Pertama
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Top Banner Copy WA */}
      <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#ECE5DE] shadow-ambient">
        <span className="text-xs text-[#73635C] font-medium flex items-center gap-1.5">
          <Milestone className="w-3.5 h-3.5 text-[#B86B70]" strokeWidth={1.75} />
          {rundown.length} Sesi Terjadwal
        </span>
        <button
          type="button"
          data-testid="button-copy-rundown-wa"
          onClick={handleCopyWhatsApp}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8F0EA] hover:bg-[#d6e5d9] text-[#58755E] text-xs font-semibold transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#58755E]" strokeWidth={2.5} />
              <span>Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#58755E]" strokeWidth={1.75} />
              <span>Salin Teks WA</span>
            </>
          )}
        </button>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 flex flex-col gap-3 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[1px] before:bg-[#ECE5DE]">
        {rundown.map((item, idx) => (
          <div
            key={item.id}
            data-testid={`rundown-item-${item.id}`}
            className="relative bg-white p-3.5 rounded-xl border border-[#ECE5DE] shadow-ambient flex flex-col gap-1.5"
          >
            {/* Timeline node dot */}
            <div className="absolute -left-[18.5px] top-4 w-2.5 h-2.5 rounded-full bg-[#B86B70] ring-4 ring-[#FAF8F5]" />

            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-[#B86B70] tabular-nums tracking-tight">
                  {item.time}
                </span>
                <h4 className="font-serif text-sm font-semibold text-[#3A302C] mt-0.5">
                  {idx + 1}. {item.activity}
                </h4>
              </div>

              <button
                type="button"
                data-testid={`button-delete-rundown-${item.id}`}
                onClick={() => onDelete(item.id)}
                className="opacity-40 hover:opacity-100 hover:text-[#B86B70] text-[#A89B95] p-1 rounded-md transition-opacity cursor-pointer shrink-0"
                aria-label="Hapus sesi"
              >
                <Trash2 className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex items-center gap-3 text-[10px] text-[#73635C] flex-wrap mt-0.5">
              <span className="flex items-center gap-1 bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#ECE5DE]">
                <UserCheck className="w-3 h-3 text-[#58755E]" strokeWidth={1.75} />
                <span>PIC: {item.pic}</span>
              </span>
              {item.location && (
                <span className="flex items-center gap-1 bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#ECE5DE]">
                  <MapPin className="w-3 h-3 text-[#B86B70]" strokeWidth={1.75} />
                  <span>{item.location}</span>
                </span>
              )}
            </div>

            {item.notes && (
              <p className="text-[11px] text-[#A89B95] italic mt-1 leading-relaxed">
                &ldquo;{item.notes}&rdquo;
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
