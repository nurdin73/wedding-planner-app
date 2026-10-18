import React, { useRef, useState } from 'react';
import { X, Download, Share2, Loader2, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import { StoryCardPreview } from './story-card-preview';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose }) => {
  const { state } = useWeddingPlanner();
  const { profile, checklist, expenses, guests } = state;

  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const generateImage = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    try {
      return await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // Crisp high-res for mobile screens
      });
    } catch (err) {
      console.error('Failed to export story card:', err);
      return null;
    }
  };

  const handleDownload = async () => {
    setIsExporting(true);
    const dataUrl = await generateImage();
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = `Janji-Suci-${profile.brideName || 'Wedding'}-Story.png`;
      link.href = dataUrl;
      link.click();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }
    setIsExporting(false);
  };

  const handleShare = async () => {
    setIsExporting(true);
    const dataUrl = await generateImage();
    if (dataUrl) {
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], 'wedding-milestone.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Janji Suci — ${profile.brideName} & ${profile.groomName}`,
            text: `Menghitung hari menuju hari bahagia pernikahan kami! ✨`,
            files: [file],
          });
        } else {
          // Fallback to direct download if Web Share is not supported
          handleDownload();
        }
      } catch (err) {
        console.error('Error sharing file:', err);
        handleDownload();
      }
    }
    setIsExporting(false);
  };

  return (
    <div
      data-testid="story-generator-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#3A302C]/60 backdrop-blur-md overflow-y-auto"
    >
      <div className="w-full max-w-sm flex flex-col items-center my-auto">
        {/* Top Header Controls */}
        <div className="w-full flex items-center justify-between text-white mb-3 px-2">
          <span className="font-serif text-lg font-semibold tracking-wide">
            Generator Story 9:16
          </span>
          <button
            type="button"
            data-testid="button-close-story-modal"
            onClick={onClose}
            className="p-1 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* 9:16 Canvas Card Container */}
        <div className="w-full flex justify-center py-1">
          <StoryCardPreview
            ref={cardRef}
            profile={profile}
            checklist={checklist}
            expenses={expenses}
            guests={guests}
          />
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-[340px] flex gap-2.5 mt-4">
          <button
            type="button"
            data-testid="button-download-story"
            onClick={handleDownload}
            disabled={isExporting}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#3A302C] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#B86B70]" />
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-[#58755E]" strokeWidth={2.5} />
                <span className="text-[#58755E]">Tersimpan!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#B86B70]" strokeWidth={1.75} />
                <span>Unduh Gambar</span>
              </>
            )}
          </button>

          <button
            type="button"
            data-testid="button-share-story"
            onClick={handleShare}
            disabled={isExporting}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#B86B70] hover:bg-[#a65d62] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" strokeWidth={1.75} />
            <span>Bagikan Story</span>
          </button>
        </div>
      </div>
    </div>
  );
};
