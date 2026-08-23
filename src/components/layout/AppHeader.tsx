import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  Crown, 
  ChevronDown, 
  Sparkles,
  Download
} from 'lucide-react';
import { type User } from '../../types';

import { AquaMustangsLogo } from '../common/AquaMustangsLogo';

interface AppHeaderProps {
  onOpenPwaGuide?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenPwaGuide }) => {
  const { currentUser, users, loginUser, isAdmin } = useApp();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'head_coach':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">HEAD COACH</span>;
      case 'assistant_coach':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">ASST COACH</span>;
      case 'diving_coach':
        return <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded">DIVE COACH</span>;
      case 'captain':
        return <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1"><Crown className="w-2.5 h-2.5" /> CAPTAIN</span>;
      case 'diver':
        return <span className="bg-sky-500/20 text-sky-300 text-[10px] font-semibold px-1.5 py-0.5 rounded">DIVER</span>;
      case 'manager':
        return <span className="bg-purple-500/20 text-purple-300 text-[10px] font-semibold px-1.5 py-0.5 rounded">MANAGER</span>;
      default:
        return <span className="bg-emerald-800/40 text-emerald-300 text-[10px] font-medium px-1.5 py-0.5 rounded">SWIMMER</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#06241b]/95 backdrop-blur-md border-b border-emerald-800/30 text-white shadow-lg pt-safe">
      <div className="max-w-4xl mx-auto px-3.5 py-2.5 flex items-center justify-between">
        
        {/* Brand & Minimal Logo */}
        <div className="flex items-center gap-2.5 min-w-0">
          <AquaMustangsLogo size="md" />

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-sm sm:text-base tracking-tight text-white truncate m-0">
                Aqua Mustangs
              </h1>
              <span className="text-amber-400 font-bold text-xs truncate">MVHS Swim &amp; Dive</span>
            </div>
            <p className="text-[10px] text-emerald-300/80 font-medium tracking-wide flex items-center gap-1 m-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              2026 Season • Suburban East Conf.
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* PWA Guide button */}
          {onOpenPwaGuide && (
            <button
              onClick={onOpenPwaGuide}
              title="Install Aqua Mustangs on iPhone / Android"
              className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 text-amber-300 border border-amber-400/30 transition flex items-center gap-1 text-xs font-semibold px-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Install App</span>
            </button>
          )}

          {/* User Profile / Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/50 transition shadow-sm text-left"
            >
              {currentUser?.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-full object-cover border border-amber-400/60"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-amber-300 font-bold text-xs flex items-center justify-center border border-amber-400/60">
                  {currentUser?.name.charAt(0) || 'U'}
                </div>
              )}

              <div className="hidden xs:block text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-100 max-w-[100px] truncate leading-tight">
                    {currentUser?.name.split(' ')[0]}
                  </span>
                  {isAdmin && <ShieldCheck className="w-3 h-3 text-amber-400" />}
                </div>
                <div className="text-[9px] text-emerald-300 font-medium">
                  {isAdmin ? 'Admin View' : 'Student View'}
                </div>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-emerald-300 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Switch User Menu Modal/Dropdown */}
            {showUserDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40 bg-black/40" 
                  onClick={() => setShowUserDropdown(false)} 
                />
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-emerald-700/60 rounded-2xl shadow-2xl p-2.5 z-50 text-slate-100 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1.5 border-b border-slate-800 mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Switch Demo Role
                      </span>
                      <span className="text-[10px] text-slate-400">Testing Switcher</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Switch between Coaches, Captains, and Athletes to test views & permissions:
                    </p>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
                    {/* Coaches Section */}
                    <div className="text-[10px] font-bold uppercase text-emerald-400 px-2 py-0.5">
                      Coaches (Admins)
                    </div>
                    {users.filter((u: User) => u.role.includes('coach')).map((u: User) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          loginUser(u.id);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition ${
                          currentUser?.id === u.id ? 'bg-emerald-800/80 border border-amber-400/60 font-bold' : 'hover:bg-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={u.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <span className="truncate">{u.name}</span>
                        </div>
                        {getRoleBadge(u.role)}
                      </button>
                    ))}

                    {/* Captains Section */}
                    <div className="text-[10px] font-bold uppercase text-amber-400 px-2 py-0.5 mt-2">
                      Team Captains (Admins)
                    </div>
                    {users.filter((u: User) => u.role === 'captain').map((u: User) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          loginUser(u.id);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition ${
                          currentUser?.id === u.id ? 'bg-emerald-800/80 border border-amber-400/60 font-bold' : 'hover:bg-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={u.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <span className="truncate">{u.name} (Gr {u.grade})</span>
                        </div>
                        {getRoleBadge(u.role)}
                      </button>
                    ))}

                    {/* Regular Athletes Section */}
                    <div className="text-[10px] font-bold uppercase text-sky-400 px-2 py-0.5 mt-2">
                      Athletes &amp; Swimmers
                    </div>
                    {users.filter((u: User) => ['swimmer', 'diver', 'manager'].includes(u.role)).map((u: User) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          loginUser(u.id);
                          setShowUserDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition ${
                          currentUser?.id === u.id ? 'bg-emerald-800/80 border border-amber-400/60 font-bold' : 'hover:bg-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={u.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                          <span className="truncate">{u.name} (Gr {u.grade})</span>
                        </div>
                        {getRoleBadge(u.role)}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400">Team Code: <code className="text-amber-400 font-mono">MUSTANGS2025</code> • Admin PIN: <code className="text-amber-400 font-mono">2026</code></span>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
