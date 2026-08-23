import React, { useState } from 'react';
import { type TeamEvent, type User, type RSVPStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, XCircle, AlertCircle, HelpCircle, Copy, Check } from 'lucide-react';

import { isAthleteApplicableForEvent } from '../../utils/eventPermissions';

interface EventAttendanceModalProps {
  event: TeamEvent;
  isOpen: boolean;
  onClose: () => void;
}

interface AttendanceItem {
  user: User;
  status: RSVPStatus;
  note?: string;
}

export const EventAttendanceModal: React.FC<EventAttendanceModalProps> = ({ event, isOpen, onClose }) => {
  const { users } = useApp();
  const [filter, setFilter] = useState<'all' | RSVPStatus>('all');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Filter athletes applicable to this event discipline (Swimmers vs Divers vs All for Socials)
  const athletes = users.filter((u: User) => 
    ['captain', 'swimmer', 'diver', 'manager'].includes(u.role) && 
    isAthleteApplicableForEvent(u, event.type)
  );

  const goingList: { user: User; note?: string }[] = [];
  const excusedList: { user: User; note?: string }[] = [];
  const notGoingList: { user: User; note?: string }[] = [];
  const pendingList: { user: User }[] = [];

  athletes.forEach((user: User) => {
    const rsvp = event.rsvps[user.id];
    if (!rsvp || rsvp.status === 'pending') {
      pendingList.push({ user });
    } else if (rsvp.status === 'going') {
      goingList.push({ user, note: rsvp.notes });
    } else if (rsvp.status === 'excused') {
      excusedList.push({ user, note: rsvp.notes });
    } else if (rsvp.status === 'not_going') {
      notGoingList.push({ user, note: rsvp.notes });
    }
  });

  const getFilteredAthletes = (): AttendanceItem[] => {
    switch (filter) {
      case 'going':
        return goingList.map(item => ({ user: item.user, note: item.note, status: 'going' as RSVPStatus }));
      case 'excused':
        return excusedList.map(item => ({ user: item.user, note: item.note, status: 'excused' as RSVPStatus }));
      case 'not_going':
        return notGoingList.map(item => ({ user: item.user, note: item.note, status: 'not_going' as RSVPStatus }));
      case 'pending':
        return pendingList.map(item => ({ user: item.user, note: undefined, status: 'pending' as RSVPStatus }));
      default:
        return [
          ...goingList.map(item => ({ user: item.user, note: item.note, status: 'going' as RSVPStatus })),
          ...excusedList.map(item => ({ user: item.user, note: item.note, status: 'excused' as RSVPStatus })),
          ...notGoingList.map(item => ({ user: item.user, note: item.note, status: 'not_going' as RSVPStatus })),
          ...pendingList.map(item => ({ user: item.user, note: undefined, status: 'pending' as RSVPStatus }))
        ];
    }
  };

  const copyRosterToClipboard = () => {
    const summaryText = `Aqua Mustangs (MVHS) - Attendance for ${event.title} (${event.date})
Total Athletes: ${athletes.length}
Going (${goingList.length}): ${goingList.map(i => i.user.name).join(', ')}
Excused/Late (${excusedList.length}): ${excusedList.map(i => `${i.user.name} (${i.note || 'No note'})`).join(', ')}
Not Going (${notGoingList.length}): ${notGoingList.map(i => `${i.user.name} (${i.note || 'No note'})`).join(', ')}
Missing/No Response (${pendingList.length}): ${pendingList.map(i => i.user.name).join(', ')}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredItems = getFilteredAthletes();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-700/60 rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#06241b] flex items-start justify-between">
          <div className="pr-4">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
              Admin Attendance Dashboard
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white mt-1 leading-snug">
              {event.title}
            </h3>
            <p className="text-xs text-emerald-300 mt-0.5">
              📅 {event.date} • {event.startTime} - {event.endTime}
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick KPI Stat Chips */}
        <div className="grid grid-cols-4 gap-1.5 p-3 bg-slate-950 border-b border-slate-800 text-center">
          <button
            onClick={() => setFilter(filter === 'going' ? 'all' : 'going')}
            className={`p-2 rounded-xl transition ${
              filter === 'going' ? 'bg-emerald-900/90 border border-emerald-500' : 'bg-slate-900/90 hover:bg-slate-800'
            }`}
          >
            <div className="text-base font-extrabold text-emerald-400">{goingList.length}</div>
            <div className="text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Going
            </div>
          </button>

          <button
            onClick={() => setFilter(filter === 'excused' ? 'all' : 'excused')}
            className={`p-2 rounded-xl transition ${
              filter === 'excused' ? 'bg-amber-950/90 border border-amber-500' : 'bg-slate-900/90 hover:bg-slate-800'
            }`}
          >
            <div className="text-base font-extrabold text-amber-400">{excusedList.length}</div>
            <div className="text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-400" /> Excused
            </div>
          </button>

          <button
            onClick={() => setFilter(filter === 'not_going' ? 'all' : 'not_going')}
            className={`p-2 rounded-xl transition ${
              filter === 'not_going' ? 'bg-rose-950/90 border border-rose-500' : 'bg-slate-900/90 hover:bg-slate-800'
            }`}
          >
            <div className="text-base font-extrabold text-rose-400">{notGoingList.length}</div>
            <div className="text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1">
              <XCircle className="w-3 h-3 text-rose-400" /> Can't Go
            </div>
          </button>

          <button
            onClick={() => setFilter(filter === 'pending' ? 'all' : 'pending')}
            className={`p-2 rounded-xl transition ${
              filter === 'pending' ? 'bg-slate-800 border border-slate-500' : 'bg-slate-900/90 hover:bg-slate-800'
            }`}
          >
            <div className="text-base font-extrabold text-slate-300">{pendingList.length}</div>
            <div className="text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1">
              <HelpCircle className="w-3 h-3 text-slate-400" /> Missing
            </div>
          </button>
        </div>

        {/* Attendance List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No athletes in this category.
            </div>
          ) : (
            filteredItems.map(({ user, status, note }) => {
              return (
                <div 
                  key={user.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img 
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                      alt="" 
                      className="w-8 h-8 rounded-full object-cover border border-slate-700 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-xs text-white truncate">
                          {user.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                          Gr {user.grade || 'N/A'} • {user.role.toUpperCase()}
                        </span>
                      </div>

                      {note ? (
                        <p className="text-[11px] text-amber-300 italic truncate mt-0.5">
                          "{note}"
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-400 truncate">
                          {user.phone || 'No phone'}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex-shrink-0 pl-2">
                    {status === 'going' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/90 border border-emerald-600/40 px-2 py-1 rounded-lg">
                        <CheckCircle2 className="w-3 h-3" /> Going
                      </span>
                    )}
                    {status === 'excused' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-950/90 border border-amber-600/40 px-2 py-1 rounded-lg">
                        <AlertCircle className="w-3 h-3" /> Excused
                      </span>
                    )}
                    {status === 'not_going' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/90 border border-rose-600/40 px-2 py-1 rounded-lg">
                        <XCircle className="w-3 h-3" /> Out
                      </span>
                    )}
                    {status === 'pending' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-800 border border-slate-600/40 px-2 py-1 rounded-lg">
                        <HelpCircle className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-2">
          <button
            onClick={copyRosterToClipboard}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            {copied ? 'Copied Attendance List!' : 'Copy Summary'}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-md"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
