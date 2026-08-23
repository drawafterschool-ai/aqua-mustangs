import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { type TeamEvent, type EventType, type RSVPStatus, type RSVPRecord } from '../types';
import { getUserDiscipline, isUserAllowedToViewEvent } from '../utils/eventPermissions';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Plus, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Bus, 
  ExternalLink,
  Edit2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScheduleViewProps {
  onOpenAttendance: (eventId: string) => void;
  onOpenCreateEvent: (event?: TeamEvent) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ onOpenAttendance, onOpenCreateEvent }) => {
  const { events, currentUser, isAdmin, setRSVP } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<'all' | EventType>('all');
  const [noteModalEventId, setNoteModalEventId] = useState<string | null>(null);
  const [rsvpNote, setRsvpNote] = useState<string>('');

  const discipline = getUserDiscipline(currentUser);

  // Filter only events the user is allowed to see (Swimmers see Swimmer+Socials, Divers see Diver+Socials)
  const allowedEvents = events.filter((evt: TeamEvent) => isUserAllowedToViewEvent(currentUser, evt));

  const filteredEvents = allowedEvents
    .filter((evt: TeamEvent) => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'swimmers_meet') return evt.type === 'swimmers_meet' || evt.type === 'meet';
      if (selectedFilter === 'divers_meet') return evt.type === 'divers_meet';
      if (selectedFilter === 'swimmers_practice') return evt.type === 'swimmers_practice' || evt.type === 'practice';
      if (selectedFilter === 'divers_practice') return evt.type === 'divers_practice';
      if (selectedFilter === 'social') return evt.type === 'social';
      return evt.type === selectedFilter;
    })
    .sort((a: TeamEvent, b: TeamEvent) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleRSVP = (eventId: string, status: RSVPStatus) => {
    if (status === 'excused') {
      setNoteModalEventId(eventId);
      return;
    }

    setRSVP(eventId, status);
    if (status === 'going') {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#0A3E2F', '#F59E0B', '#10B981']
      });
    }
  };

  const handleSaveExcusedNote = () => {
    if (noteModalEventId) {
      setRSVP(noteModalEventId, 'excused', rsvpNote);
      setNoteModalEventId(null);
      setRsvpNote('');
    }
  };

  const getEventBadge = (type: EventType) => {
    switch (type) {
      case 'swimmers_meet':
      case 'meet':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">🏊 SWIMMERS MEET</span>;
      case 'divers_meet':
        return <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">🤿 DIVERS MEET</span>;
      case 'swimmers_practice':
      case 'practice':
        return <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">⏱️ SWIMMERS PRACTICE</span>;
      case 'divers_practice':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">🤸 DIVERS PRACTICE</span>;
      case 'social':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">🍝 GET-TOGETHER</span>;
      default:
        return <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full">EVENT</span>;
    }
  };

  const canEditEvent = (event: TeamEvent) => {
    if (isAdmin) return true;
    if (event.type === 'social' && event.createdBy === currentUser?.id) return true;
    return false;
  };

  const isMeetType = (type: EventType) => type === 'swimmers_meet' || type === 'divers_meet' || type === 'meet';

  return (
    <div className="space-y-4 pb-24 pt-2 animate-in fade-in">
      
      {/* Header & Controls */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Team Schedule</h2>
          <p className="text-xs text-emerald-300">
            {discipline === 'swimmer' 
              ? 'Swimmer dual meets, swim practices & team socials' 
              : discipline === 'diver'
                ? 'Diving invitationals, board practices & team socials'
                : 'Meets, practices, and pasta parties'}
          </p>
        </div>

        {/* Dynamic Action Button based on Role */}
        {isAdmin ? (
          <button
            onClick={() => onOpenCreateEvent()}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg border border-amber-400/40 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        ) : (
          <button
            onClick={() => onOpenCreateEvent()}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg border border-amber-300/40 transition"
            title="Plan a team pasta party or social"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Plan Social 🍝</span>
          </button>
        )}
      </div>

      {/* Athlete Discipline Status Pill */}
      {discipline !== 'all' && (
        <div className="p-2.5 bg-[#06241b] rounded-2xl border border-emerald-700/50 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <span className="text-base">{discipline === 'swimmer' ? '🏊' : '🤿'}</span>
            <span>
              <strong>{discipline === 'swimmer' ? 'Swimmer Portal:' : 'Diver Portal:'}</strong> Viewing {discipline === 'swimmer' ? 'Swimmer' : 'Diver'} events &amp; team get-togethers
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
            {discipline.toUpperCase()}
          </span>
        </div>
      )}

      {/* Filter Categories - Tailored to Athlete Discipline */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
            selectedFilter === 'all'
              ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          {discipline === 'all' ? `All Events (${allowedEvents.length})` : `My Schedule (${allowedEvents.length})`}
        </button>

        {/* Swimmers Meets Tab (Only for Swimmers & Coaches) */}
        {(discipline === 'all' || discipline === 'swimmer') && (
          <button
            onClick={() => setSelectedFilter('swimmers_meet')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1 ${
              selectedFilter === 'swimmers_meet'
                ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <span>🏊 Swimmers Meets</span>
            <span className="text-[10px] opacity-80">
              ({allowedEvents.filter((e: TeamEvent) => e.type === 'swimmers_meet' || e.type === 'meet').length})
            </span>
          </button>
        )}

        {/* Divers Meets Tab (Only for Divers & Coaches) */}
        {(discipline === 'all' || discipline === 'diver') && (
          <button
            onClick={() => setSelectedFilter('divers_meet')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1 ${
              selectedFilter === 'divers_meet'
                ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <span>🤿 Divers Meets</span>
            <span className="text-[10px] opacity-80">
              ({allowedEvents.filter((e: TeamEvent) => e.type === 'divers_meet').length})
            </span>
          </button>
        )}

        {/* Swimmers Practice Tab (Only for Swimmers & Coaches) */}
        {(discipline === 'all' || discipline === 'swimmer') && (
          <button
            onClick={() => setSelectedFilter('swimmers_practice')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1 ${
              selectedFilter === 'swimmers_practice'
                ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <span>⏱️ Swimmers Practice</span>
            <span className="text-[10px] opacity-80">
              ({allowedEvents.filter((e: TeamEvent) => e.type === 'swimmers_practice' || e.type === 'practice').length})
            </span>
          </button>
        )}

        {/* Divers Practice Tab (Only for Divers & Coaches) */}
        {(discipline === 'all' || discipline === 'diver') && (
          <button
            onClick={() => setSelectedFilter('divers_practice')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1 ${
              selectedFilter === 'divers_practice'
                ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <span>🤸 Divers Practice</span>
            <span className="text-[10px] opacity-80">
              ({allowedEvents.filter((e: TeamEvent) => e.type === 'divers_practice').length})
            </span>
          </button>
        )}

        {/* Socials / Get-Togethers Tab (Visible to EVERYONE) */}
        <button
          onClick={() => setSelectedFilter('social')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition flex items-center gap-1 ${
            selectedFilter === 'social'
              ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
        >
          <span>🍝 Get-Togethers</span>
          <span className="text-[10px] opacity-80">
            ({allowedEvents.filter((e: TeamEvent) => e.type === 'social').length})
          </span>
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 rounded-3xl border border-slate-800 p-6">
            <CalendarIcon className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-300">No events found in this category.</p>
            <p className="text-xs text-slate-500 mt-1">
              {isAdmin ? 'Click Add Event to create a meet or practice.' : 'Click Plan Social to organize a pasta party!'}
            </p>
          </div>
        ) : (
          filteredEvents.map((event: TeamEvent) => {
            const myRSVP = currentUser ? event.rsvps[currentUser.id]?.status : undefined;
            const myNote = currentUser ? event.rsvps[currentUser.id]?.notes : undefined;

            const goingCount = Object.values(event.rsvps).filter((r: RSVPRecord) => r.status === 'going').length;
            const excusedCount = Object.values(event.rsvps).filter((r: RSVPRecord) => r.status === 'excused').length;
            const notGoingCount = Object.values(event.rsvps).filter((r: RSVPRecord) => r.status === 'not_going').length;

            const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(event.location)}`;
            const isEditable = canEditEvent(event);
            const isMeet = isMeetType(event.type);

            return (
              <div 
                key={event.id}
                className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-emerald-800/40 hover:border-emerald-700 shadow-xl text-slate-100 transition relative overflow-hidden"
              >
                {/* Event Top Bar */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getEventBadge(event.type)}

                    {isMeet && (
                      event.isHome ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                          Home Meet
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 flex items-center gap-1">
                          <Bus className="w-3 h-3" /> Away
                        </span>
                      )
                    )}

                    <span className="text-xs text-slate-400 font-mono">
                      📅 {event.date}
                    </span>
                  </div>

                  {isEditable && (
                    <button
                      onClick={() => onOpenCreateEvent(event)}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 px-2 py-0.5 rounded-lg bg-slate-800 flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {/* Event Title */}
                <h3 className="text-base sm:text-lg font-black text-white mt-2">
                  {event.title}
                </h3>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{event.startTime} - {event.endTime}</span>
                    {event.warmupTime && (
                      <span className="text-amber-300 font-semibold">• Warmup: {event.warmupTime}</span>
                    )}
                  </div>

                  <a 
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-emerald-300 hover:text-amber-300 transition truncate"
                  >
                    <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="truncate">{event.location}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0 text-slate-400" />
                  </a>
                </div>

                {event.busDepartureTime && (
                  <div className="mt-2 text-xs text-amber-300 font-semibold flex items-center gap-1.5 p-2 bg-amber-950/40 rounded-xl border border-amber-800/40">
                    <Bus className="w-4 h-4 text-amber-400" />
                    <span>Bus departs MVHS promptly at {event.busDepartureTime}</span>
                  </div>
                )}

                {event.description && (
                  <p className="text-xs text-slate-300 mt-2 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                    {event.description}
                  </p>
                )}

                {event.snackVolunteer && (
                  <div className="mt-2 text-[11px] text-emerald-300 font-medium">
                    🧁 Host / Volunteer: <span className="text-slate-200">{event.snackVolunteer}</span>
                  </div>
                )}

                {/* Event Host / Planner Credit */}
                {event.createdByName && event.type === 'social' && (
                  <div className="text-[10px] text-slate-400 pt-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Planned by: <span className="text-amber-300 font-semibold">{event.createdByName}</span>
                  </div>
                )}

                {/* STUDENT RSVP BUTTONS */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">
                      Attendance Confirmation (RSVP):
                    </span>
                    {myRSVP && (
                      <span className={`text-[11px] font-bold ${
                        myRSVP === 'going' ? 'text-emerald-400' : myRSVP === 'excused' ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {myRSVP === 'going' ? '✓ Attending' : myRSVP === 'excused' ? `⚠️ Excused ${myNote ? `("${myNote}")` : ''}` : '✗ Not Attending'}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleRSVP(event.id, 'going')}
                      className={`py-2 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1 transition ${
                        myRSVP === 'going'
                          ? 'bg-emerald-600 text-white shadow-lg border border-amber-300'
                          : 'bg-slate-800 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Going</span>
                    </button>

                    <button
                      onClick={() => handleRSVP(event.id, 'excused')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${
                        myRSVP === 'excused'
                          ? 'bg-amber-600 text-white shadow-md border border-amber-300'
                          : 'bg-slate-800 hover:bg-amber-950 text-slate-300 hover:text-amber-300 border border-slate-700'
                      }`}
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Late / Note</span>
                    </button>

                    <button
                      onClick={() => handleRSVP(event.id, 'not_going')}
                      className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${
                        myRSVP === 'not_going'
                          ? 'bg-rose-700 text-white shadow-md border border-rose-400'
                          : 'bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Can't Go</span>
                    </button>
                  </div>

                  {/* ATTENDANCE SUMMARY BAR */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-emerald-400 font-bold">
                        {goingCount} Going
                      </span>
                      {excusedCount > 0 && (
                        <span className="text-amber-400 font-semibold">
                          {excusedCount} Excused
                        </span>
                      )}
                      {notGoingCount > 0 && (
                        <span className="text-rose-400 font-semibold">
                          {notGoingCount} Out
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onOpenAttendance(event.id)}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800 hover:bg-emerald-900 transition"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Attendance Roster</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* EXCUSED NOTE PROMPT MODAL */}
      {noteModalEventId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-700/60 rounded-3xl max-w-sm w-full p-5 text-slate-100 shadow-2xl">
            <h3 className="text-base font-extrabold text-white mb-1">Late or Excused Note</h3>
            <p className="text-xs text-slate-400 mb-3">Please provide a quick note for Coach &amp; Captains:</p>
            
            <input
              type="text"
              autoFocus
              value={rsvpNote}
              onChange={e => setRsvpNote(e.target.value)}
              placeholder="e.g. Arriving 30m late from tutoring / Doctor appt"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setNoteModalEventId(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveExcusedNote}
                className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
              >
                Submit RSVP
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
