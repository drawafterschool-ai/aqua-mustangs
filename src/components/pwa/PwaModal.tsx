import React, { useState } from 'react';
import { Download, Smartphone, Apple, CheckCircle2, Share, PlusSquare, MoreVertical, X } from 'lucide-react';

interface PwaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaModal: React.FC<PwaModalProps> = ({ isOpen, onClose }) => {
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-700/60 rounded-3xl max-w-md w-full p-5 sm:p-6 text-slate-100 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-[#0A3E2F] flex items-center justify-center border border-amber-400/50 text-amber-300 shadow-lg">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">Install App on Phone</h3>
            <p className="text-xs text-emerald-300">Run as a native app on iPhone &amp; Android</p>
          </div>
        </div>

        {/* Platform Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl mb-5 border border-slate-800">
          <button
            onClick={() => setPlatform('ios')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
              platform === 'ios' 
                ? 'bg-emerald-800 text-amber-300 shadow-sm border border-amber-400/40' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Apple className="w-4 h-4" /> iPhone (iOS)
          </button>
          <button
            onClick={() => setPlatform('android')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
              platform === 'android' 
                ? 'bg-emerald-800 text-amber-300 shadow-sm border border-amber-400/40' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" /> Android (Chrome)
          </button>
        </div>

        {/* Platform Steps */}
        {platform === 'ios' ? (
          <div className="space-y-3.5 text-xs text-slate-300">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="w-6 h-6 rounded-full bg-emerald-900/80 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                1
              </div>
              <div>
                <p className="font-semibold text-white">Open in Safari Browser</p>
                <p className="text-slate-400 text-[11px]">Make sure you are viewing this page in Safari on your iPhone.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="w-6 h-6 rounded-full bg-emerald-900/80 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                2
              </div>
              <div>
                <p className="font-semibold text-white flex items-center gap-1.5">
                  Tap the <Share className="w-3.5 h-3.5 text-blue-400 inline" /> Share Button
                </p>
                <p className="text-slate-400 text-[11px]">Located at the bottom center of your Safari screen.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="w-6 h-6 rounded-full bg-emerald-900/80 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                3
              </div>
              <div>
                <p className="font-semibold text-white flex items-center gap-1.5">
                  Select <PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline" /> "Add to Home Screen"
                </p>
                <p className="text-slate-400 text-[11px]">Scroll down in the share sheet and tap Add.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/50">
              <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                4
              </div>
              <div>
                <p className="font-bold text-amber-300">Open App &amp; Allow Notifications 🔔</p>
                <p className="text-emerald-200/90 text-[11px]">Open the newly installed app on your home screen and tap "Allow" for meet and schedule alerts.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 text-xs text-slate-300">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="w-6 h-6 rounded-full bg-emerald-900/80 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                1
              </div>
              <div>
                <p className="font-semibold text-white">Open in Google Chrome</p>
                <p className="text-slate-400 text-[11px]">Ensure you are viewing the website inside Chrome on Android.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="w-6 h-6 rounded-full bg-emerald-900/80 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                2
              </div>
              <div>
                <p className="font-semibold text-white flex items-center gap-1.5">
                  Tap the <MoreVertical className="w-3.5 h-3.5 text-amber-400 inline" /> Menu (3 dots)
                </p>
                <p className="text-slate-400 text-[11px]">Located in the top right corner of Chrome.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="w-6 h-6 rounded-full bg-emerald-900/80 text-amber-400 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                3
              </div>
              <div>
                <p className="font-semibold text-white flex items-center gap-1.5">
                  Tap <Download className="w-3.5 h-3.5 text-emerald-400 inline" /> "Install App"
                </p>
                <p className="text-slate-400 text-[11px]">The Aqua Mustangs icon will be added to your home screen.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/50">
              <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                4
              </div>
              <div>
                <p className="font-bold text-amber-300">Allow Notifications 🔔</p>
                <p className="text-emerald-200/90 text-[11px]">Tap "Allow" on the notification prompt for instant meet reminders and chat alerts.</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-emerald-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-amber-400" /> Push &amp; Offline enabled
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white font-bold rounded-xl transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
