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
  Lock,
  Database,
  Sparkles,
  Camera,
  KeyRound,
  Trash2,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { AvatarPickerModal } from '../components/common/AvatarPickerModal';

interface SettingsViewProps {
  onOpenPwaModal: () => void;
  onEditProfile: (user: User) => void;
  onOpenKnowledgeHub?: () => void;
  onOpenPricingModal?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  onOpenPwaModal, 
  onEditProfile, 
  onOpenKnowledgeHub,
  onOpenPricingModal 
}) => {
  const { 
    currentUser, 
    isAdmin, 
    verifyAdminSecurityPin, 
    isAdminPinVerified, 
    resetAllDataToDefaults,
    isCloudConnected,
    seedCloudFirestore,
    eraseAllSampleData,
    updateUser,
    teamPasscode,
    adminPin,
    updateTeamPasscode,
    updateAdminSecurityPin
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [pinMessage, setPinMessage] = useState<string | null>(null);
  const [resetConfirmed, setResetConfirmed] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Credentials Edit State
  const [showChangeCreds, setShowChangeCreds] = useState(false);
  const [newTeamPasscode, setNewTeamPasscode] = useState(teamPasscode);
  const [newAdminPin, setNewAdminPin] = useState(adminPin);
  const [credsSuccessMsg, setCredsSuccessMsg] = useState<string | null>(null);

  // Erase Sample Data State
  const [showEraseConfirm, setShowEraseConfirm] = useState(false);
  const [eraseInput, setEraseInput] = useState('');
  const [isErasing, setIsErasing] = useState(false);
  const [eraseStatusMsg, setEraseStatusMsg] = useState<string | null>(null);

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

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamPasscode.trim()) {
      updateTeamPasscode(newTeamPasscode.trim());
    }
    if (newAdminPin.trim()) {
      updateAdminSecurityPin(newAdminPin.trim());
    }
    setCredsSuccessMsg('Security PIN & Team Passcode updated successfully!');
    setTimeout(() => setCredsSuccessMsg(null), 4000);
  };

  const handleResetData = () => {
    resetAllDataToDefaults();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 3000);
  };

  const handleEraseSampleData = async () => {
    if (eraseInput.trim().toUpperCase() !== 'ERASE') {
      alert('Please type ERASE to confirm wiping all sample data.');
      return;
    }
    setIsErasing(true);
    const result = await eraseAllSampleData();
    setIsErasing(false);
    setShowEraseConfirm(false);
    setEraseInput('');
    setEraseStatusMsg(result.message);
    setTimeout(() => setEraseStatusMsg(null), 5000);
  };

  const handleSaveAvatar = (newAvatar: string) => {
    if (currentUser) {
      updateUser(currentUser.id, { avatar: newAvatar });
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-2 animate-in fade-in max-w-xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          {isAdmin ? 'Admin Hub & Settings' : 'My Athlete Profile & Settings'}
        </h2>
        <p className="text-xs text-emerald-300">
          Profile details, parent contacts, security PIN, and database management
        </p>
      </div>

      {/* Profile Card */}
      {currentUser && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-emerald-800/40 shadow-xl text-slate-100 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img 
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                alt="" 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
              />
              <button
                onClick={() => setShowAvatarPicker(true)}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full border-2 border-slate-900 shadow-md transition"
                title="Change profile photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
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
              <span className="text-[10px] text-slate-400">
                {currentUser.parents?.length || 0} Registered
              </span>
            </div>

            {(!currentUser.parents || currentUser.parents.length === 0) ? (
              <p className="text-xs text-slate-400 italic">No parent info added yet.</p>
            ) : (
              <div className="space-y-1.5">
                {currentUser.parents.map((p: ParentInfo) => (
                  <div key={p.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{p.name}</span>
                      <span className="text-[10px] text-emerald-300 ml-1.5">({p.relationship})</span>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{p.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => onEditProfile(currentUser)}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 rounded-xl border border-slate-700 transition"
          >
            Edit Profile Details &amp; Parents
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

      {/* KNOWLEDGE HUB TILE */}
      {onOpenKnowledgeHub && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-700/60 shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center border border-amber-400/40">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white">Team Knowledge Hub</h4>
              <p className="text-[11px] text-emerald-300">Handbook, Lettering, Safety EAP &amp; Booster Guides</p>
            </div>
          </div>

          <button
            onClick={onOpenKnowledgeHub}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-extrabold shadow-md border border-amber-400/40 transition flex items-center gap-1.5 whitespace-nowrap"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Open Hub</span>
          </button>
        </div>
      )}

      {/* PRO PLANS & 15-DAY FREE TRIAL TILE */}
      {onOpenPricingModal && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/60 border border-amber-400/50 shadow-xl flex items-center justify-between gap-3 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center border border-amber-300 shadow-md">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs sm:text-sm font-extrabold text-white">Pro Plans &amp; Price Tiers</h4>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase">
                  15-Day Free Trial
                </span>
              </div>
              <p className="text-[11px] text-slate-300">Starter, Varsity Pro, and Athletic District subscription options</p>
            </div>
          </div>

          <button
            onClick={onOpenPricingModal}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black shadow-md border border-amber-200 transition flex items-center gap-1.5 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>View Tiers</span>
          </button>
        </div>
      )}

      {/* CHANGE SECURITY PIN & PASSCODE FOR ALL USERS */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-emerald-700/60 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs sm:text-sm font-extrabold text-white">Security PIN &amp; Passcode</h4>
          </div>
          <button
            onClick={() => setShowChangeCreds(!showChangeCreds)}
            className="text-[11px] font-bold text-amber-300 hover:underline px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700"
          >
            {showChangeCreds ? 'Hide Editor' : 'Change PIN / Passcode'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Current Team Code</span>
            <span className="font-mono font-black text-amber-400 text-sm mt-0.5 block">{teamPasscode}</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Coach Admin PIN</span>
            <span className="font-mono font-black text-white text-sm mt-0.5 block">{adminPin}</span>
          </div>
        </div>

        {showChangeCreds && (
          <form onSubmit={handleSaveCredentials} className="p-3 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-3 animate-in fade-in">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                New Team Passcode (For Athlete &amp; Parent Entry)
              </label>
              <input
                type="text"
                value={newTeamPasscode}
                onChange={e => setNewTeamPasscode(e.target.value.toUpperCase())}
                placeholder="e.g. MUSTANGS2026"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                New Coach / Admin Security PIN (4-6 digits)
              </label>
              <input
                type="text"
                maxLength={6}
                value={newAdminPin}
                onChange={e => setNewAdminPin(e.target.value)}
                placeholder="e.g. 2026"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white text-xs font-bold rounded-xl shadow-md border border-amber-400/40 transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save &amp; Update Credentials</span>
            </button>
          </form>
        )}

        {credsSuccessMsg && (
          <p className="text-xs font-bold text-emerald-400 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-600/40 flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-amber-400" />
            <span>{credsSuccessMsg}</span>
          </p>
        )}
      </div>

      {/* COACH ADMIN PIN VERIFICATION */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs sm:text-sm font-extrabold text-white">Unlock Admin PIN on this Device</h4>
          </div>
          {isAdminPinVerified ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
              PIN Verified ({adminPin})
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              PIN Locked
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400">
          Unlocks admin operations on shared devices.
        </p>

        <form onSubmit={handleVerifyPin} className="flex gap-2">
          <input
            type="password"
            maxLength={6}
            value={pinInput}
            onChange={e => setPinInput(e.target.value)}
            placeholder={`Enter PIN (${adminPin})`}
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

      {/* CLOUD FIRESTORE SYNC & STATUS */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-emerald-700/60 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs sm:text-sm font-extrabold text-white">Cloud Firestore Database</h4>
          </div>
          {isCloudConnected ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync Active
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/60">
              Local Storage Mode
            </span>
          )}
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          {isCloudConnected 
            ? 'Connected to Google Cloud Firestore (aqua-mustangs). All RSVPs, roster changes, events, and chats sync in real-time.' 
            : 'Fill in your Firebase project keys in the .env file to enable real-time Cloud Firestore sync across multiple devices.'}
        </p>

        {isCloudConnected && (
          <div className="pt-1">
            <button
              onClick={async () => {
                const res = await seedCloudFirestore();
                alert(res.message);
              }}
              className="px-3.5 py-2 bg-emerald-800/80 hover:bg-emerald-700 text-amber-300 border border-amber-400/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seed Sample Roster &amp; Events to Firestore</span>
            </button>
          </div>
        )}
      </div>

      {/* ADMIN DATA MANAGEMENT: ERASE SAMPLE DATA (CLEAN SLATE) */}
      {isAdmin && (
        <div className="p-4 rounded-3xl bg-rose-950/40 border border-rose-800/60 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <h4 className="text-xs sm:text-sm font-extrabold text-white">Erase All Sample Data</h4>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-900 text-rose-200 border border-rose-700">
              Admin Action
            </span>
          </div>

          <p className="text-xs text-rose-200/90 leading-relaxed">
            Wipe all demo athletes, sample meets, practices, and test messages so your coaches can start with a <strong>100% clean team roster</strong>.
          </p>

          {!showEraseConfirm ? (
            <button
              onClick={() => setShowEraseConfirm(true)}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Start Clean Slate (Erase Sample Data)</span>
            </button>
          ) : (
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-rose-600/60 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Type <strong>ERASE</strong> below to confirm wiping all sample data:</span>
              </div>

              <input
                type="text"
                value={eraseInput}
                onChange={e => setEraseInput(e.target.value)}
                placeholder="Type ERASE"
                className="w-full bg-slate-900 border border-rose-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-rose-400"
              />

              <div className="flex items-center gap-2">
                <button
                  onClick={handleEraseSampleData}
                  disabled={isErasing || eraseInput.trim().toUpperCase() !== 'ERASE'}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-lg transition"
                >
                  {isErasing ? 'Wiping Database...' : 'Confirm & Wipe Sample Data'}
                </button>

                <button
                  onClick={() => {
                    setShowEraseConfirm(false);
                    setEraseInput('');
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {eraseStatusMsg && (
            <p className="text-xs font-bold text-emerald-400 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-600/40 flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-amber-400" />
              <span>{eraseStatusMsg}</span>
            </p>
          )}
        </div>
      )}

      {/* RESET TO DEMO DATA (RECOVERY) */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-emerald-400" /> Restore Sample Demo Data
        </h4>
        <p className="text-xs text-slate-400">
          Restore the default Mounds View Mustangs sample roster and calendar events for testing.
        </p>

        <button
          onClick={handleResetData}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          {resetConfirmed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <RotateCcw className="w-3.5 h-3.5" />}
          {resetConfirmed ? 'Restored Demo Data!' : 'Restore Demo Data'}
        </button>
      </div>

      {/* TEAM INFO FOOTER */}
      <div className="text-center pt-3 text-slate-500 text-xs space-y-1">
        <p className="font-bold text-slate-400">Aqua Mustangs • Mounds View High School Girls Swim &amp; Dive</p>
        <p className="text-[11px]">Section 4AA • Minnesota MSHSL • 2026-2027 Season</p>
        <p className="text-[10px] text-amber-400/80 font-mono">Team Passcode: {teamPasscode} • Admin PIN: {adminPin}</p>
      </div>

      {currentUser && (
        <AvatarPickerModal 
          isOpen={showAvatarPicker}
          onClose={() => setShowAvatarPicker(false)}
          currentAvatar={currentUser.avatar || ''}
          userName={currentUser.name}
          onSaveAvatar={handleSaveAvatar}
        />
      )}

    </div>
  );
};
