import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, Heart } from 'lucide-react';
import { type User, type UserRole, type ParentInfo, type AthleteType } from '../../types';

interface EditAthleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUser?: User | null;
  onSaved?: (user: User, isNew: boolean) => void;
}

export const EditAthleteModal: React.FC<EditAthleteModalProps> = ({ isOpen, onClose, initialUser, onSaved }) => {
  const { addUser, updateUser } = useApp();

  const [name, setName] = useState(initialUser?.name || '');
  const [role, setRole] = useState<UserRole>(initialUser?.role || 'swimmer');
  const [grade, setGrade] = useState<number>(initialUser?.grade || 10);
  const [email, setEmail] = useState(initialUser?.email || '');
  const [phone, setPhone] = useState(initialUser?.phone || '');
  const [birthday, setBirthday] = useState(initialUser?.birthday || '2008-01-01');
  const avatar = initialUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
  const bio = initialUser?.bio || '';
  const [eventsStr, setEventsStr] = useState(initialUser?.events ? initialUser.events.join(', ') : '50 Free, 100 Free');
  const [emergencyNotes, setEmergencyNotes] = useState(initialUser?.emergencyNotes || '');
  const [parents, setParents] = useState<ParentInfo[]>(initialUser?.parents || [
    {
      id: `p-${Date.now()}`,
      name: '',
      relationship: 'Mother',
      phone: '',
      email: '',
      isPrimary: true,
      isEmergencyContact: true
    }
  ]);

  if (!isOpen) return null;

  const handleAddParent = () => {
    setParents(prev => [
      ...prev,
      {
        id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: '',
        relationship: 'Father',
        phone: '',
        email: '',
        isPrimary: false,
        isEmergencyContact: true
      }
    ]);
  };

  const handleRemoveParent = (id: string) => {
    setParents(prev => prev.filter(p => p.id !== id));
  };

  const handleParentChange = (id: string, field: keyof ParentInfo, value: any) => {
    setParents(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const events = eventsStr.split(',').map(s => s.trim()).filter(Boolean);
    const validParents = parents.filter(p => p.name.trim().length > 0);

    const isAdmin = role.includes('coach') || role === 'captain';

    const athleteType: AthleteType = role === 'diver' || role === 'diving_coach' ? 'diver' : 'swimmer';

    const userData = {
      name,
      role,
      athleteType,
      grade: role.includes('coach') ? undefined : (grade as 9 | 10 | 11 | 12),
      email,
      phone,
      birthday,
      avatar,
      bio,
      events,
      emergencyNotes,
      parents: validParents,
      isAdmin
    };

    if (initialUser) {
      updateUser(initialUser.id, userData);
      if (onSaved) {
        onSaved({ ...userData, id: initialUser.id }, false);
      }
    } else {
      const newId = `u-${Date.now()}`;
      addUser(userData);
      if (onSaved) {
        onSaved({ ...userData, id: newId }, true);
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-700/60 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#06241b] flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white">
              {initialUser ? 'Edit Athlete & Parents' : 'Add New Athlete / Coach'}
            </h3>
            <p className="text-xs text-emerald-300">Mounds View High School Roster</p>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Role & Grade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Team Role *</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="swimmer">Swimmer</option>
                <option value="diver">Diver</option>
                <option value="captain">Team Captain</option>
                <option value="manager">Team Manager</option>
                <option value="head_coach">Head Coach</option>
                <option value="assistant_coach">Assistant Coach</option>
                <option value="diving_coach">Diving Coach</option>
              </select>
            </div>

            {!role.includes('coach') && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">High School Grade *</label>
                <select
                  value={grade}
                  onChange={e => setGrade(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value={12}>12th Grade (Senior)</option>
                  <option value={11}>11th Grade (Junior)</option>
                  <option value={10}>10th Grade (Sophomore)</option>
                  <option value={9}>9th Grade (Freshman)</option>
                </select>
              </div>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Emma Peterson"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@moundsviewstudents.org"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="(651) 555-0199"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Birthday & Events */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Birthday</label>
              <input
                type="date"
                value={birthday}
                onChange={e => setBirthday(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Events / Strokes</label>
              <input
                type="text"
                value={eventsStr}
                onChange={e => setEventsStr(e.target.value)}
                placeholder="50 Free, 100 Fly, 1M Diving"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Emergency Note */}
          <div>
            <label className="block text-xs font-bold text-amber-300 mb-1">Emergency / Medical Notes</label>
            <input
              type="text"
              value={emergencyNotes}
              onChange={e => setEmergencyNotes(e.target.value)}
              placeholder="e.g. Inhaler, epi-pen, food allergies..."
              className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* PARENT & GUARDIAN SECTION */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" /> Parent &amp; Guardian Info
              </label>
              <button
                type="button"
                onClick={handleAddParent}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Parent
              </button>
            </div>

            <div className="space-y-3">
              {parents.map((parent, idx) => (
                <div key={parent.id} className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300">Parent #{idx + 1}</span>
                    {parents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveParent(parent.id)}
                        className="text-rose-400 hover:text-rose-300 text-xs p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Parent Full Name"
                      value={parent.name}
                      onChange={e => handleParentChange(parent.id, 'name', e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <select
                      value={parent.relationship}
                      onChange={e => handleParentChange(parent.id, 'relationship', e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Step-Parent">Step-Parent</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="tel"
                      placeholder="Parent Phone"
                      value={parent.phone}
                      onChange={e => handleParentChange(parent.id, 'phone', e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="email"
                      placeholder="Parent Email"
                      value={parent.email}
                      onChange={e => handleParentChange(parent.id, 'email', e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-extrabold border border-amber-400/40 shadow-lg"
            >
              {initialUser ? 'Save Roster Entry' : 'Add to Team Roster'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
