import React, { useState } from 'react';
import { type User } from '../../types';
import { 
  X, 
  Mail, 
  MessageSquare, 
  Copy, 
  Check, 
  KeyRound, 
  Sparkles
} from 'lucide-react';

import { useApp } from '../../context/AppContext';

interface MemberInviteModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  isNewMember?: boolean;
}

export const MemberInviteModal: React.FC<MemberInviteModalProps> = ({ 
  user, 
  isOpen, 
  onClose, 
  isNewMember = true 
}) => {
  const { teamPasscode, adminPin } = useApp();
  const [copied, setCopied] = useState(false);
  const [emailDispatched, setEmailDispatched] = useState(false);

  if (!isOpen) return null;

  const appUrl = 'https://aqua-mustangs.web.app';
  const isCoachOrCaptain = user.role.includes('coach') || user.role === 'captain';
  const roleName = user.role.replace('_', ' ').toUpperCase();

  const emailSubject = `🐴 Welcome to Aqua Mustangs (2026-2027) - App Link & Login Credentials`;

  const emailBody = `Hi ${user.name},

Welcome to the Aqua Mustangs (Mounds View High School Girls Swim & Dive) for the 2026-2027 Season! 🐴🏊‍♀️

We’re excited to launch our official team Progressive Web App (PWA) for all athletes, coaches, and parents.

----------------------------------------------------
📲 YOUR APP LOGIN CREDENTIALS
----------------------------------------------------
• App Website: ${appUrl}
• Team Passcode: ${teamPasscode}
• Your Profile: ${user.name} (${roleName})
${isCoachOrCaptain ? `• Coach / Admin Security PIN: ${adminPin}\n` : ''}
----------------------------------------------------
📱 STEP-BY-STEP SETUP INSTRUCTIONS
----------------------------------------------------

📱 FOR IPHONE (iOS):
1. Open Safari on your iPhone and go to: ${appUrl}
2. Tap the Share icon (the square with the arrow pointing up at the bottom).
3. Scroll down and tap "Add to Home Screen", then tap "Add".
4. Open the "Aqua Mustangs" app icon from your Home Screen.
5. Enter the Team Passcode (${teamPasscode}), select your name (${user.name}), and tap "Allow" for notifications when prompted so you receive live meet alerts!

🤖 FOR ANDROID:
1. Open Google Chrome and go to: ${appUrl}
2. Tap the "Install App" banner at the bottom (or tap the 3 dots menu in the top right and select "Install App").
3. Open the app from your Home Screen.
4. Enter the Team Passcode (${teamPasscode}), select your name (${user.name}), and enable notifications.

----------------------------------------------------
🌟 WHAT YOU CAN DO IN THE APP:
----------------------------------------------------
✅ Meet & Practice RSVPs: Confirm your attendance with 1 tap so coaches can plan event heats & relays.
✅ Team Calendar: View Swimmers Meets, Divers Meets, Practices, and Pasta Parties.
✅ Parent & Athlete Directory: Quick 1-tap call, text, or email for all teammates and parents.
✅ Team Chat: Join channels for Announcements, Girls Squad, Diving Crew, and Socials.
✅ Profile Customization: Tap Settings to update your profile photo and parent info.

If you have any questions or need help logging in, feel free to reach out to the coaches or team captains!

Go Aqua Mustangs! 🐴💚💛
Mounds View High School Girls Swim & Dive`;

  const mailtoUrl = `mailto:${user.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  
  const smsBody = `Hi ${user.name}! Welcome to Aqua Mustangs 2026-2027. Open ${appUrl} and use team passcode ${teamPasscode} to access our team app!`;
  const smsUrl = `sms:${user.phone}?body=${encodeURIComponent(smsBody)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTriggerEmail = () => {
    window.location.href = mailtoUrl;
    setEmailDispatched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-700/60 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#06241b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-sm">
              <KeyRound className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {isNewMember ? 'Member Added • Send App Invite' : 'Send App Credentials & PIN'}
              </h3>
              <p className="text-[11px] text-emerald-300">
                Aqua Mustangs 2026-2027 Login Invitation
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Member Card */}
          <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <img 
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                alt="" 
                className="w-10 h-10 rounded-full object-cover border border-amber-400/60 flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-white truncate">{user.name}</div>
                <div className="text-xs text-emerald-300 truncate">{user.email || 'No email registered'}</div>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700">
              {roleName}
            </span>
          </div>

          {/* Credentials Card */}
          <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-600/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" /> Credentials Included in Email
              </span>
              <span className="text-[10px] text-emerald-300 font-mono">2026-2027</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-emerald-800/60">
                <div className="text-[10px] text-slate-400">Team Passcode</div>
                <div className="text-sm font-black text-amber-400 font-mono mt-0.5">MUSTANGS2026</div>
              </div>

              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-emerald-800/60">
                <div className="text-[10px] text-slate-400">Security PIN</div>
                <div className="text-sm font-black text-white font-mono mt-0.5">
                  {isCoachOrCaptain ? '2026 (Admin)' : 'Not required (Athlete)'}
                </div>
              </div>
            </div>
          </div>

          {/* Preview of Email Content */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Invitation Email Preview:</span>
              <span className="text-[10px] text-slate-400">To: {user.email}</span>
            </label>
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-44 overflow-y-auto">
              {emailBody}
            </div>
          </div>

          {/* Dispatch Options */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">
              Send Invitation to Athlete &amp; Parents:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={handleTriggerEmail}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg border border-amber-400/40 transition"
              >
                <Mail className="w-4 h-4 text-amber-300" />
                <span>Send via Mail Client</span>
              </button>

              {user.phone && (
                <a
                  href={smsUrl}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition"
                >
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  <span>Send via SMS / Text</span>
                </a>
              )}
            </div>

            <button
              onClick={handleCopy}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Copied Invitation & Passcode to Clipboard!' : 'Copy Full Invite Text'}</span>
            </button>
          </div>

          {emailDispatched && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Email client opened! The welcome message with passcode <strong>MUSTANGS2026</strong> is ready to send.</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Aqua Mustangs Admin Access
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
