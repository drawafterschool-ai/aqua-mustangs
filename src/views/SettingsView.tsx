import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { type User, type ParentInfo } from '../types';
import { 
  ShieldCheck, 
  Download, 
  RotateCcw, 
  Heart, 
  Smartphone, 
  Check, 
  Lock
} from 'lucide-react';

interface SettingsViewProps {
  onOpenPwaModal: () => void;
  onEditProfile: (user: User) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenPwaModal, onEditProfile }) => {
  const { 
    currentUser, 
    isAdmin, 
    verifyAdminSecurityPin, 
    isAdminPinVerified, 
    resetAllDataToDefaults 
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [pinMessage, setPinMessage] = useState<string | null>(null);
  const [resetConfirmed, setResetConfirmed] = useState(false);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyAdminSecurityPin(pinInput);
    if (success) {
      setPinMessage('PIN Verified! Full Admin controls unlocked.');
      setPinInput('');
    } else {
      setPinMessage('Incorrect PIN. (Default test PIN is 2026)');
    }
  };

  const handleResetData = () => {
    resetAllDataToDefaults();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 3000);
  };

  return (
    <div className="space-y-4 pb-24 pt-2 animate-in fade-in max-w-xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          {isAdmin ? 'Admin Hub & Settings' : 'My Athlete Profile & Settings'}
        </h2>
        <p className="text-xs text-emerald-300">
          Profile details, parent contacts, security and PWA install
        </p>
      </div>

      {/* Profile Card */}
      {currentUser && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-emerald-800/40 shadow-xl text-slate-100 space-y-4">
          <div className="flex items-center gap-4">
            <img 
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
              alt="" 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white truncate">
                  {currentUser.name}
                </h3>
                {isAdmin && <ShieldCheck className="w-4 h-4 text-amber-400" />}
              </div>
              <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                {currentUser.role.replace('_', ' ')} {currentUser.grade ? `• Grade ${currentUser.grade}` : ''}
              </p>
              <p className="text-xs text-emerald-300 truncate mt-0.5">
                {currentUser.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Phone</span>
              <span className="font-bold text-white">{currentUser.phone || 'None'}</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Birthday</span>
              <span className="font-bold text-white">{currentUser.birthday || 'None'}</span>
            </div>
          </div>

          {currentUser.events && currentUser.events.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-300 block mb-1">My Events:</span>
              <div className="flex flex-wrap gap-1">
                {currentUser.events.map((evt: string, i: number) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-200 border border-emerald-800">
                    🏊 {evt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* PARENT CONTACTS */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" /> My Parents &amp; Guardians
              </span>
              <button
                onClick={() => onEditProfile(currentUser)}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
              >
                Edit Info
              </button>
            </div>

            {currentUser.parents.length === 0 ? (
              <p className="text-xs text-slate-500">No parent details registered.</p>
            ) : (
              <div className="space-y-1.5">
                {currentUser.parents.map((p: ParentInfo) => (
                  <div key={p.id} className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{p.name}</span>
                      <span className="text-[10px] text-slate-400 ml-1">({p.relationship})</span>
                      <div className="text-[11px] text-slate-400 font-mono">{p.phone}</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Registered
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onEditProfile(currentUser)}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl transition border border-slate-700"
          >
            Edit My Profile &amp; Parent Details
          </button>
        </div>
      )}

      {/* PWA INSTALLATION TILE */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-emerald-700/60 shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center border border-amber-400/40">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-white">Install App on Phone</h4>
            <p className="text-[11px] text-slate-400">Add to iPhone or Android Home Screen</p>
          </div>
        </div>

        <button
          onClick={onOpenPwaModal}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white text-xs font-extrabold shadow-md border border-amber-400/40 transition flex items-center gap-1.5 whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Instructions</span>
        </button>
      </div>

      {/* COACH ADMIN PIN SECURITY */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs sm:text-sm font-extrabold text-white">Coach Security PIN</h4>
          </div>
          {isAdminPinVerified ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              PIN Active (2026)
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              PIN Locked
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400">
          Protects admin operations and private lineup communications on shared devices.
        </p>

        <form onSubmit={handleVerifyPin} className="flex gap-2">
          <input
            type="password"
            maxLength={6}
            value={pinInput}
            onChange={e => setPinInput(e.target.value)}
            placeholder="Enter Coach PIN (2026)"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition"
          >
            Verify
          </button>
        </form>

        {pinMessage && (
          <p className="text-xs font-semibold text-amber-300">{pinMessage}</p>
        )}
      </div>

      {/* SYSTEM & DATA MANAGEMENT */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-emerald-400" /> Reset &amp; Demo Data
        </h4>
        <p className="text-xs text-slate-400">
          Reset roster, calendar events, and team chats back to the default Mounds View Mustangs seed dataset.
        </p>

        <button
          onClick={handleResetData}
          className="px-4 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          {resetConfirmed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <RotateCcw className="w-3.5 h-3.5" />}
          {resetConfirmed ? 'Reset to Default Season Data!' : 'Reset All App Data'}
        </button>
      </div>

      {/* TEAM INFO FOOTER */}
      <div className="text-center pt-3 text-slate-500 text-xs space-y-1">
        <p className="font-bold text-slate-400">Aqua Mustangs • Mounds View High School Girls Swim &amp; Dive</p>
        <p className="text-[11px]">Suburban East Conference • Section 4AA • Minnesota MSHSL</p>
        <p className="text-[10px] text-amber-400/80 font-mono">Team Passcode: MUSTANGS2025 • Admin PIN: 2026</p>
      </div>

    </div>
  );
};
