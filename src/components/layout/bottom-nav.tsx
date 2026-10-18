import React from 'react';
import { CalendarHeart, CheckCircle2, WalletCards, Users, Building2 } from 'lucide-react';
import { useWeddingPlanner } from '../../hooks/use-wedding-planner';
import type { ActiveTab } from '../../types/wedding.types';

export const BottomNav: React.FC = () => {
  const { state, setActiveTab } = useWeddingPlanner();
  const { activeTab } = state;

  const navItems = [
    {
      id: 'home' as ActiveTab,
      label: 'Beranda',
      icon: CalendarHeart,
      disabled: false,
    },
    {
      id: 'checklist' as ActiveTab,
      label: 'Tugas',
      icon: CheckCircle2,
      disabled: false,
    },
    {
      id: 'budget' as ActiveTab,
      label: 'Anggaran',
      icon: WalletCards,
      disabled: false,
    },
    {
      id: 'guest' as ActiveTab,
      label: 'Tamu',
      icon: Users,
      disabled: false,
    },
    {
      id: 'vendor' as ActiveTab,
      label: 'Vendor',
      icon: Building2,
      disabled: false,
    },
  ];

  return (
    <nav
      data-testid="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-30 w-full backdrop-blur-md bg-white/90 border-t border-[#ECE5DE]"
    >
      <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              data-testid={`nav-item-${item.id}`}
              disabled={item.disabled}
              onClick={() => !item.disabled && setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-colors relative ${
                item.disabled
                  ? 'opacity-40 cursor-not-allowed'
                  : isActive
                  ? 'text-[#B86B70]'
                  : 'text-[#A89B95] hover:text-[#73635C]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`}
                  strokeWidth={isActive ? 2 : 1.75}
                />
              </div>
              <span
                className={`text-[11px] mt-1 tracking-tight ${
                  isActive ? 'font-semibold text-[#B86B70]' : 'font-normal'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#B86B70] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
