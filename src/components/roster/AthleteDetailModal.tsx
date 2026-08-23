import React, { useState } from 'react';
import { type User, type ParentInfo } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Phone, 
  Mail, 
  Calendar, 
  Heart, 
  ShieldAlert, 
  Edit, 
  Trash2, 
  MessageSquare,
  Trophy
} from 'lucide-react';

interface AthleteDetailModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (user: User) => void;
}

export const AthleteDetailModal: React.FC<AthleteDetailModalProps> = ({ user, isOpen, onClose, onEdit }) => {
  const { isAdmin, deleteUser } = useApp();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen) return null;

  const calculateAge = (birthday: string) => {
    if (!birthday) return '';
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'head_coach': return 'Head Coach';
      case 'assistant_coach': return 'Assistant Coach';
      case 'diving_coach': return 'Diving Coach';
      case 'captain': return 'Team Captain';
      case 'diver': return 'Varsity / JV Diver';
      case 'manager': return 'Student Team Manager';
      default: return 'Varsity / JV Swimmer';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-700/60 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Profile Banner */}
        <div className="relative p-5 bg-gradient-to-r from-[#06241b] via-[#0A3E2F] to-[#041a13] border-b border-emerald-800/40">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'} 
              alt={user.name} 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-xl"
            />
            <div className="min-w-0 pr-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  {getRoleLabel(user.role)}
                </span>
                {user.grade && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-900 text-emerald-200">
                    Grade {user.grade}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-extrabold text-white mt-1 truncate">
                {user.name}
              </h2>

              <p className="text-xs text-emerald-300/90 font-medium">
                Aqua Mustangs • MVHS 2026
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Quick Athlete Contacts */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${user.phone}`}
              className="p-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/50 flex items-center gap-2 text-xs font-semibold text-emerald-300 transition"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400">Call Athlete</div>
                <div className="text-xs font-bold text-white truncate">{user.phone || 'No phone'}</div>
              </div>
            </a>

            <a
              href={`mailto:${user.email}`}
              className="p-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/50 flex items-center gap-2 text-xs font-semibold text-emerald-300 transition"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400">Email Athlete</div>
                <div className="text-xs font-bold text-white truncate">{user.email || 'No email'}</div>
              </div>
            </a>
          </div>

          {/* Bio / Quote */}
          {user.bio && (
            <div className="p-3 bg-slate-950/70 rounded-2xl border border-slate-800 text-xs text-slate-300 italic">
              "{user.bio}"
            </div>
          )}

          {/* Athlete Info Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400" /> Birthday
              </div>
              <div className="text-xs font-bold text-white mt-0.5">
                {user.birthday ? `${user.birthday} (${calculateAge(user.birthday)} yrs)` : 'N/A'}
              </div>
            </div>

            {user.tShirtSize && (
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">T-Shirt Size</div>
                <div className="text-xs font-bold text-white mt-0.5">Size {user.tShirtSize}</div>
              </div>
            )}

            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">Team Status</div>
              <div className="text-xs font-bold text-emerald-400 mt-0.5">Active Roster</div>
            </div>
          </div>

          {/* Events / Strokes */}
          {user.events && user.events.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Primary Events &amp; Strokes
              </label>
              <div className="flex flex-wrap gap-1.5">
                {user.events.map((evt: string, idx: number) => (
                  <span 
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-600/40 text-emerald-200 text-xs font-medium"
                  >
                    🏊 {evt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Emergency / Medical Notes */}
          {user.emergencyNotes && (
            <div className="p-3 bg-amber-950/40 border border-amber-600/40 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
                <ShieldAlert className="w-4 h-4 text-amber-400" /> Medical / Emergency Note
              </div>
              <p className="text-xs text-amber-100/90">{user.emergencyNotes}</p>
            </div>
          )}

          {/* PARENTS & GUARDIANS DIRECTORY */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-400" /> Parents &amp; Emergency Contacts
              </label>
              <span className="text-[10px] text-slate-400">
                {user.parents?.length || 0} Listed
              </span>
            </div>

            {(!user.parents || user.parents.length === 0) ? (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
                No parent details registered yet.
              </div>
            ) : (
              <div className="space-y-2">
                {user.parents.map((parent: ParentInfo) => (
                  <div 
                    key={parent.id}
                    className="p-3 bg-slate-950/90 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{parent.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/80 text-emerald-300 font-medium">
                            {parent.relationship}
                          </span>
                          {parent.isEmergencyContact && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800">
                              Emergency Contact
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`tel:${parent.phone}`}
                        className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="truncate">{parent.phone}</span>
                      </a>

                      <a
                        href={`sms:${parent.phone}`}
                        className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                        <span>Text Parent</span>
                      </a>
                    </div>

                    {parent.email && (
                      <a
                        href={`mailto:${parent.email}`}
                        className="block text-[11px] text-slate-400 hover:text-amber-300 truncate pt-0.5"
                      >
                        ✉️ {parent.email}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(user)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 transition flex items-center gap-1.5 border border-slate-700"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Profile &amp; Parents
              </button>

              {confirmDelete ? (
                <button
                  onClick={() => {
                    deleteUser(user.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-xs font-bold text-white transition"
                >
                  Confirm Delete
                </button>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition"
                  title="Remove from roster"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-slate-400">
              Aqua Mustangs Directory
            </div>
          )}

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
