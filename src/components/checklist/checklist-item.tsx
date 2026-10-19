import React from 'react';
import { Check, Trash2, Pencil } from 'lucide-react';
import type { ChecklistItem as ChecklistItemType } from '../../types/wedding.types';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (item: ChecklistItemType) => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({
  item,
  onToggle,
  onDelete,
  onEdit,
}) => {
  return (
    <div
      data-testid={`checklist-item-${item.id}`}
      className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all ${
        item.isCompleted
          ? 'bg-[#FAF8F5]/80 border-[#ECE5DE]/70 opacity-75'
          : 'bg-white border-[#ECE5DE] shadow-ambient hover:border-[#B86B70]/40'
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
        <button
          type="button"
          data-testid={`checkbox-task-${item.id}`}
          onClick={() => onToggle(item.id)}
          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer border ${
            item.isCompleted
              ? 'bg-[#58755E] border-[#58755E] text-white'
              : 'border-[#A89B95] hover:border-[#58755E] bg-white'
          }`}
          aria-label={item.isCompleted ? 'Tandai belum selesai' : 'Tandai selesai'}
        >
          {item.isCompleted && <Check className="w-3.5 h-3.5" strokeWidth={2.5} />}
        </button>

        <div className="flex flex-col min-w-0 flex-1">
          <span
            className={`text-xs leading-snug transition-all ${
              item.isCompleted
                ? 'line-through text-[#A89B95]'
                : 'text-[#3A302C] font-medium'
            }`}
          >
            {item.title}
          </span>
          {item.notes && (
            <span className="text-[10px] text-[#A89B95] truncate mt-0.5">
              {item.notes}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {onEdit && (
          <button
            type="button"
            data-testid={`button-edit-task-${item.id}`}
            onClick={() => onEdit(item)}
            className="opacity-40 group-hover:opacity-100 hover:text-[#58755E] text-[#A89B95] p-1 rounded-md transition-opacity cursor-pointer"
            aria-label="Edit tugas"
          >
            <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        )}
        <button
          type="button"
          data-testid={`button-delete-task-${item.id}`}
          onClick={() => onDelete(item.id)}
          className="opacity-40 group-hover:opacity-100 hover:text-[#B86B70] text-[#A89B95] p-1 rounded-md transition-opacity cursor-pointer"
          aria-label="Hapus tugas"
        >
          <Trash2 className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
};
