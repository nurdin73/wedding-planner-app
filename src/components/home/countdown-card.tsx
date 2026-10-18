import React, { useState, useEffect } from 'react';
import { CalendarHeart } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import { calculateTimeRemaining, formatIndonesianDate } from '../../utils/date.utils';

export const CountdownCard: React.FC = () => {
  const { state } = useWeddingPlanner();
  const { profile } = state;

  const [remaining, setRemaining] = useState(() =>
    calculateTimeRemaining(profile.weddingDate)
  );

  useEffect(() => {
    if (!profile.weddingDate) return;
    const interval = setInterval(() => {
      setRemaining(calculateTimeRemaining(profile.weddingDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [profile.weddingDate]);

  const formattedDate = formatIndonesianDate(profile.weddingDate);

  return (
    <div
      data-testid="home-countdown-card"
      className="w-full bg-white rounded-2xl p-5 border border-[#ECE5DE] shadow-ambient relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-[#B86B70]">
          <CalendarHeart className="w-4 h-4" strokeWidth={1.75} />
          <span className="text-[11px] font-medium uppercase tracking-widest text-[#B86B70]">
            Hitung Mundur Hari Bahagia
          </span>
        </div>
        <span className="text-xs text-[#73635C] font-normal">
          {formattedDate || 'Tanggal belum diatur'}
        </span>
      </div>

      <div className="text-center my-2">
        <h3 className="font-serif text-2xl font-semibold text-[#3A302C] tracking-wide">
          {profile.brideName} & {profile.groomName}
        </h3>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-[#ECE5DE]/70">
        <div className="flex flex-col items-center p-2 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE]/50">
          <span
            data-testid="countdown-days"
            className="font-sans text-xl font-bold text-[#3A302C] tabular-nums"
          >
            {remaining.days}
          </span>
          <span className="text-[10px] text-[#A89B95] uppercase tracking-wider mt-0.5">Hari</span>
        </div>

        <div className="flex flex-col items-center p-2 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE]/50">
          <span
            data-testid="countdown-hours"
            className="font-sans text-xl font-bold text-[#3A302C] tabular-nums"
          >
            {String(remaining.hours).padStart(2, '0')}
          </span>
          <span className="text-[10px] text-[#A89B95] uppercase tracking-wider mt-0.5">Jam</span>
        </div>

        <div className="flex flex-col items-center p-2 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE]/50">
          <span
            data-testid="countdown-minutes"
            className="font-sans text-xl font-bold text-[#3A302C] tabular-nums"
          >
            {String(remaining.minutes).padStart(2, '0')}
          </span>
          <span className="text-[10px] text-[#A89B95] uppercase tracking-wider mt-0.5">Menit</span>
        </div>

        <div className="flex flex-col items-center p-2 rounded-xl bg-[#FAF8F5] border border-[#ECE5DE]/50">
          <span
            data-testid="countdown-seconds"
            className="font-sans text-xl font-bold text-[#B86B70] tabular-nums"
          >
            {String(remaining.seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] text-[#A89B95] uppercase tracking-wider mt-0.5">Detik</span>
        </div>
      </div>
    </div>
  );
};
