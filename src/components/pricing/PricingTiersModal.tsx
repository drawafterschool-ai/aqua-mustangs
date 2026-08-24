import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  X, 
  ShieldCheck, 
  Clock, 
  Flame 
} from 'lucide-react';

interface PricingTiersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingTiersModal: React.FC<PricingTiersModalProps> = ({ isOpen, onClose }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'season'>('season');
  const [trialActivated, setTrialActivated] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'district'>('pro');

  if (!isOpen) return null;

  const handleStartTrial = (planName: string) => {
    setTrialActivated(true);
    setTimeout(() => {
      alert(`🎉 15-Day Free Trial activated for ${planName}! All Pro features (Push Notifications, Knowledge Hub, Cloud Firestore, Discipline Separation) are unlocked.`);
      setTrialActivated(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-700/60 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-[#06241b] via-[#0A3E2F] to-[#041a13] flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 tracking-wider">
                15-Day Free Trial
              </span>
              <span className="text-xs text-emerald-300 font-bold">No Credit Card Required</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-1">
              Aqua Mustangs App Plans &amp; Price Tiers
            </h2>
            <p className="text-xs text-slate-300">
              Modern high school varsity swim &amp; dive management for coaches, athletes, and parents
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 15-Day Free Trial Banner */}
        <div className="p-3 bg-emerald-950/80 border-b border-emerald-700/50 flex items-center justify-between gap-3 text-xs px-4 sm:px-6">
          <div className="flex items-center gap-2 text-emerald-200">
            <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Special Offer:</strong> Test the app with your entire team for <strong>15 days free</strong> with unlimited access.
            </span>
          </div>

          {/* Billing Switch */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 flex-shrink-0">
            <button
              onClick={() => setBillingCycle('season')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition ${
                billingCycle === 'season' 
                  ? 'bg-emerald-700 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Annual Season (Save 25%)
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition ${
                billingCycle === 'monthly' 
                  ? 'bg-emerald-700 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Price Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* TIER 1: STARTER */}
          <div 
            onClick={() => setSelectedPlan('starter')}
            className={`p-5 rounded-3xl border text-left flex flex-col justify-between cursor-pointer transition ${
              selectedPlan === 'starter'
                ? 'bg-slate-900 border-emerald-500 shadow-xl'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 opacity-90'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-300">STARTER TEAM</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  Single Squad
                </span>
              </div>

              <div className="flex items-baseline gap-1 my-3">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {billingCycle === 'season' ? '$199' : '$19'}
                </span>
                <span className="text-xs text-slate-400">
                  {billingCycle === 'season' ? '/season' : '/month'}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mb-4">
                Essential schedule, RSVPs, and parent directory for smaller clubs and JV teams.
              </p>

              <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Up to 30 athletes &amp; parents</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>iPhone &amp; Android PWA Install</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Meet &amp; Practice Calendar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>1-Tap RSVP Attendance</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <X className="w-4 h-4 flex-shrink-0" />
                  <span>Discipline separation</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <X className="w-4 h-4 flex-shrink-0" />
                  <span>Knowledge Hub &amp; Policies</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStartTrial('Starter Plan')}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Start 15-Day Free Trial
            </button>
          </div>

          {/* TIER 2: VARSITY PRO (RECOMMENDED) */}
          <div 
            onClick={() => setSelectedPlan('pro')}
            className={`p-5 rounded-3xl border-2 text-left flex flex-col justify-between cursor-pointer transition relative ${
              selectedPlan === 'pro'
                ? 'bg-gradient-to-b from-emerald-950/90 to-slate-900 border-amber-400 shadow-2xl scale-102 ring-4 ring-amber-400/20'
                : 'bg-emerald-950/40 border-emerald-700/60 hover:border-amber-400/60'
            }`}
          >
            {/* Best Value Badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow flex items-center gap-1">
              <Flame className="w-3 h-3 fill-slate-950" /> Most Popular Varsity Plan
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-amber-300">VARSITY PRO</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  Complete Solution
                </span>
              </div>

              <div className="flex items-baseline gap-1 my-3">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {billingCycle === 'season' ? '$349' : '$39'}
                </span>
                <span className="text-xs text-emerald-300 font-bold">
                  {billingCycle === 'season' ? '/season' : '/month'}
                </span>
              </div>

              <p className="text-[11px] text-emerald-200/90 mb-4">
                Full-featured app for varsity programs with discipline separation, push notifications, and Knowledge Hub.
              </p>

              <div className="space-y-2 text-xs text-slate-200 pt-3 border-t border-emerald-800/60">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <strong className="text-white">Unlimited athletes, coaches &amp; parents</strong>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>🏊‍♀️ Swimmers vs Divers Event Separation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>🔔 Live Push Notifications (iOS &amp; Android)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>📚 Knowledge Hub &amp; Handbooks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>🔥 Google Cloud Firestore Live Real-Time Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>💌 1-Tap Preformatted Member Invites</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStartTrial('Varsity Pro Plan')}
              disabled={trialActivated}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs shadow-lg border border-amber-300 flex items-center justify-center gap-1.5 transition"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{trialActivated ? 'Activating Pro Trial...' : 'Start 15-Day Free Trial'}</span>
            </button>
          </div>

          {/* TIER 3: ATHLETIC DISTRICT */}
          <div 
            onClick={() => setSelectedPlan('district')}
            className={`p-5 rounded-3xl border text-left flex flex-col justify-between cursor-pointer transition ${
              selectedPlan === 'district'
                ? 'bg-slate-900 border-emerald-500 shadow-xl'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 opacity-90'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-300">ATHLETIC DISTRICT</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                  Multi-Sport
                </span>
              </div>

              <div className="flex items-baseline gap-1 my-3">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {billingCycle === 'season' ? '$699' : '$79'}
                </span>
                <span className="text-xs text-slate-400">
                  {billingCycle === 'season' ? '/year' : '/month'}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mb-4">
                Designed for high school athletic directors managing all varsity &amp; junior varsity teams.
              </p>

              <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>All sports (Swim, Dive, Track, etc.)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Custom School Domain &amp; Logo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Centralized District Admin Hub</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Dedicated 1-on-1 Coach Onboarding</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>24/7 Priority Support</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStartTrial('Athletic District Plan')}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Start 15-Day Free Trial
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> Cancel anytime during the 15-day trial with 1 click
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
