import React from 'react';

export interface TabType {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: TabType[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export default function TabNavigation({ tabs, activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className="flex gap-6 mb-8 border-b border-zinc-800 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors relative whitespace-nowrap ${
            activeTab === tab.id ? 'text-yellow-500' : 'text-zinc-600 hover:text-zinc-300'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500 rounded-t-full shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
          )}
        </button>
      ))}
    </div>
  );
}