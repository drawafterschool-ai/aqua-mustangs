import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { type UserRole, type User } from '../../types';
import { X } from 'lucide-react';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({ isOpen, onClose }) => {
  const { createChannel, users, isAdmin } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🏊‍♀️');
  const [type, setType] = useState<'public' | 'admins_only' | 'girls_only' | 'custom'>('public');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const emojiOptions = ['🏊‍♀️', '🤿', '👑', '📢', '🍝', '⚡', '🏆', '🔥', '🎉', '🚗', '💪', '💚'];

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createChannel(
      name,
      description,
      icon,
      type,
      type === 'admins_only' ? (['head_coach', 'assistant_coach', 'diving_coach', 'captain'] as UserRole[]) : undefined,
      type === 'custom' ? selectedUserIds : undefined
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-700/60 rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#06241b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <div>
              <h3 className="text-base font-extrabold text-white">Create Group Chat</h3>
              <p className="text-xs text-emerald-300">Set up custom team channel</p>
            </div>
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
          
          {/* Emoji Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Channel Icon</label>
            <div className="flex flex-wrap gap-2 p-2 bg-slate-950 rounded-2xl border border-slate-800">
              {emojiOptions.map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setIcon(em)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition ${
                    icon === em ? 'bg-emerald-800 border-2 border-amber-400 scale-110' : 'hover:bg-slate-800'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Channel Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Group Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Sprint Free Squad, Bus Ride Vibes..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Description / Topic</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Chat for 50/100 sprinters & relay drills"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Channel Privacy Type */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Who can join?</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('public')}
                className={`p-2.5 rounded-xl border text-left text-xs transition ${
                  type === 'public' ? 'bg-emerald-900/80 border-amber-400 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-amber-400 font-bold mb-0.5">🌟 Open Team</div>
                <div className="text-[10px] text-slate-300">All swimmers, divers &amp; coaches</div>
              </button>

              <button
                type="button"
                onClick={() => setType('girls_only')}
                className={`p-2.5 rounded-xl border text-left text-xs transition ${
                  type === 'girls_only' ? 'bg-emerald-900/80 border-amber-400 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-pink-400 font-bold mb-0.5">🏊‍♀️ Girls Only</div>
                <div className="text-[10px] text-slate-300">All student athletes</div>
              </button>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setType('admins_only')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition ${
                    type === 'admins_only' ? 'bg-emerald-900/80 border-amber-400 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="text-amber-400 font-bold mb-0.5">👑 Admins Only</div>
                  <div className="text-[10px] text-slate-300">Coaches &amp; Captains only</div>
                </button>
              )}

              <button
                type="button"
                onClick={() => setType('custom')}
                className={`p-2.5 rounded-xl border text-left text-xs transition ${
                  type === 'custom' ? 'bg-emerald-900/80 border-amber-400 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="text-cyan-400 font-bold mb-0.5">👥 Select Members</div>
                <div className="text-[10px] text-slate-300">Pick specific athletes</div>
              </button>
            </div>
          </div>

          {/* Member Picker for Custom Groups */}
          {type === 'custom' && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                <span>Select Group Members</span>
                <span className="text-[10px] text-amber-400">{selectedUserIds.length} Selected</span>
              </label>
              <div className="max-h-40 overflow-y-auto space-y-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                {users.map((u: User) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => toggleUserSelection(u.id)}
                    className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs transition ${
                      selectedUserIds.includes(u.id) ? 'bg-emerald-800 text-white font-bold' : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={u.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                      <span>{u.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{u.role}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

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
              Create Group
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
