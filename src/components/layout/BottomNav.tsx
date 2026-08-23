import React from 'react';
import { Home, Calendar, Users, MessageSquare, Settings, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type TabType = 'home' | 'schedule' | 'roster' | 'chat' | 'settings';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const { isAdmin } = useApp();

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'roster', label: 'Roster', icon: Users },
    { id: 'chat', label: 'Team Chat', icon: MessageSquare },
    { id: 'settings', label: isAdmin ? 'Admin / More' : 'Profile', icon: isAdmin ? Shield : Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#06241b]/95 backdrop-blur-lg border-t border-emerald-800/40 shadow-2xl pb-safe">
      <div className="max-w-md mx-auto px-3 py-1 flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative ${
                isActive 
                  ? 'text-amber-400 font-bold scale-105' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {tab.id === 'chat' && (
                  <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-slate-900 animate-pulse" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-1 ${isActive ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-0.5 w-4 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
