import React from 'react';

export type TabType = {
  id: string;
  label: string;
};

interface TabNavigationProps {
  tabs: TabType[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export default function TabNavigation({ tabs, activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="flex justify-center mb-8 relative z-10 animate-in slide-in-from-top-4 duration-500">
      {/* THÂN KÍNH (GLASS PILL) */}
      <div className="flex gap-1 p-1.5 bg-zinc-900/40 backdrop-blur-lg border border-white/10 rounded-full shadow-2xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${isActive
                  ? 'text-black'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
            >
              {/* HIỆU ỨNG HIGHLIGHT MÀU VÀNG CHẠY BÊN DƯỚI */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)] -z-10 animate-in zoom-in-90 duration-200"></div>
              )}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}