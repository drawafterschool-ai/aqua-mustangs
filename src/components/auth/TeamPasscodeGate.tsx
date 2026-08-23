import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, CheckCircle2, ArrowRight, Crown, ShieldCheck } from 'lucide-react';
import { type User } from '../../types';

import { AquaMustangsLogo } from '../common/AquaMustangsLogo';

export const TeamPasscodeGate: React.FC = () => {
  const { verifyTeamPasscode, users, loginUser } = useApp();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>(users[0]?.id || '');
  const [step, setStep] = useState<'passcode' | 'profile'>('passcode');

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = verifyTeamPasscode(passcode);
    if (ok) {
      setError(null);
      setStep('profile');
    } else {
      setError('Invalid team passcode. Tip: Use MUSTANGS2025');
    }
  };

  const handleCompleteLogin = () => {
    if (selectedUser) {
      loginUser(selectedUser);
    }
  };

  return (
    <div className="min-h-screen bg-[#041a13] bg-gradient-to-b from-[#041a13] via-[#062c20] to-[#030f0b] flex items-center justify-center p-4 text-slate-100">
      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-emerald-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Decorative Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Logo & School Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="mx-auto flex justify-center mb-1">
            <AquaMustangsLogo size="xl" />
          </div>

          <h1 className="text-3xl font-black text-white tracking-tight pt-2">
            Aqua Mustangs
          </h1>
          <p className="text-sm font-bold text-amber-400 uppercase tracking-widest">
            Mounds View Girls Swim &amp; Dive 2026
          </p>
          <p className="text-xs text-emerald-300/90 max-w-xs mx-auto">
            Official Progressive Web App for Athletes, Coaches &amp; Parents
          </p>
        </div>

        {step === 'passcode' ? (
          /* STEP 1: TEAM PASSCODE GATE */
          <form onSubmit={handlePasscodeSubmit} className="space-y-4 relative z-10">
            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" /> Enter Team Passcode
                </span>
                <span className="text-[10px] text-amber-400 font-mono">MUSTANGS2025</span>
              </label>

              <input
                type="text"
                autoFocus
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Enter MUSTANGS2025"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono uppercase tracking-wider"
              />
            </div>

            {error && (
              <p className="text-xs font-bold text-rose-400 text-center animate-shake">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-sm rounded-2xl shadow-xl border border-amber-400/50 transition flex items-center justify-center gap-2"
            >
              <span>Unlock Aqua Mustangs App</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setPasscode('MUSTANGS2025');
                  verifyTeamPasscode('MUSTANGS2025');
                  setStep('profile');
                }}
                className="text-xs text-amber-300 hover:underline font-semibold"
              >
                Auto-fill Team Code &amp; Continue ➔
              </button>
            </div>
          </form>
        ) : (
          /* STEP 2: SELECT PROFILE */
          <div className="space-y-4 relative z-10">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                Select Your Profile:
              </label>
              <p className="text-[11px] text-slate-400">
                Choose your swimmer, diver, or coach account:
              </p>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1.5 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800 pr-1">
              {users.map((u: User) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setSelectedUser(u.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition ${
                    selectedUser === u.id 
                      ? 'bg-emerald-800 text-white font-bold border border-amber-400' 
                      : 'hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={u.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <div className="font-bold text-white leading-tight">{u.name}</div>
                      <div className="text-[10px] text-emerald-300">{u.role.replace('_', ' ')} {u.grade ? `(Gr ${u.grade})` : ''}</div>
                    </div>
                  </div>

                  {u.role === 'captain' && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                  {u.role.includes('coach') && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>

            <button
              onClick={handleCompleteLogin}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-sm rounded-2xl shadow-xl border border-amber-400/50 transition flex items-center justify-center gap-2"
            >
              <span>Enter Aqua Mustangs App</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Security & PWA Badges */}
        <div className="pt-2 border-t border-slate-800 text-center text-[11px] text-slate-400 flex items-center justify-center gap-4">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle2 className="w-3 h-3 text-amber-400" /> iPhone &amp; Android PWA
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Offline Ready</span>
        </div>

      </div>
    </div>
  );
};
