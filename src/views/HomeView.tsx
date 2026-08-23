import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { type TabType } from '../components/layout/BottomNav';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Users, 
  MessageSquare, 
  Sparkles, 
  Bus, 
  ShieldCheck, 
  Bell, 
  PhoneCall
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { type TeamEvent, type User, type TeamAnnouncement, type RSVPRecord } from '../types';
import { isUserAllowedToViewEvent } from '../utils/eventPermissions';

interface HomeViewProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenAttendance?: (eventId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigateTab, onOpenAttendance }) => {
  const { 
    currentUser, 
    events, 
    announcements, 
    setRSVP, 
    isAdmin, 
    users 
  } = useApp();

  // Find next upcoming meet applicable to the current athlete (Swimmer vs Diver)
  const upcomingMeets = events
    .filter((e: TeamEvent) => {
      const isMeet = e.type === 'swimmers_meet' || e.type === 'divers_meet' || e.type === 'meet';
      return isMeet && isUserAllowedToViewEvent(currentUser, e);
    })
    .sort((a: TeamEvent, b: TeamEvent) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const nextMeet = upcomingMeets[0] || null;

  // Countdown to next meet
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number }>({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (!nextMeet) return;
    const targetDate = new Date(`${nextMeet.date}T${nextMeet.startTime}:00`);

    const updateTimer = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft({ days, hours, minutes });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [nextMeet]);

  const handleRSVPWithConfetti = (eventId: string, status: 'going' | 'not_going' | 'excused') => {
    setRSVP(eventId, status);
    if (status === 'going') {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0A3E2F', '#F59E0B', '#10B981', '#FCD34D']
      });
    }
  };

  const myNextMeetRSVP = currentUser && nextMeet ? nextMeet.rsvps[currentUser.id]?.status : undefined;

  return (
    <div className="space-y-4 pb-20 pt-2 animate-in fade-in">
      
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#062c20] via-[#0a3e2f] to-[#041a13] border border-emerald-700/50 p-4 sm:p-5 shadow-xl text-white">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                {isAdmin ? <ShieldCheck className="w-3 h-3 text-amber-400" /> : <Sparkles className="w-3 h-3 text-amber-400" />}
                {isAdmin ? 'Admin Dashboard' : 'Athletes Portal'}
              </span>
              <span className="text-[11px] text-emerald-300 font-medium hidden sm:inline">
                Aqua Mustangs 🐴
              </span>
            </div>

            <div className="text-[11px] text-slate-300 font-mono">
              2026 to 2027 Season
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mt-2 tracking-tight">
            Welcome back, {currentUser?.name.split(' ')[0] || 'Mustang'}!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/90 mt-0.5">
            {isAdmin 
              ? 'Track meet rosters, monitor athlete RSVPs, and post announcements.' 
              : 'Check upcoming meets, confirm your attendance, and chat with teammates.'}
          </p>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-800/40">
            <div 
              onClick={() => onNavigateTab('schedule')}
              className="cursor-pointer bg-emerald-950/60 hover:bg-emerald-900/80 p-2.5 rounded-2xl border border-emerald-800/50 transition text-center"
            >
              <div className="text-base sm:text-lg font-extrabold text-amber-400 font-mono">
                {events.filter((e: TeamEvent) => e.type === 'swimmers_meet' || e.type === 'divers_meet' || e.type === 'meet').length}
              </div>
              <div className="text-[10px] text-slate-300 font-semibold mt-0.5">Team Meets</div>
            </div>

            <div 
              onClick={() => onNavigateTab('roster')}
              className="cursor-pointer bg-emerald-950/60 hover:bg-emerald-900/80 p-2.5 rounded-2xl border border-emerald-800/50 transition text-center"
            >
              <div className="text-base sm:text-lg font-extrabold text-emerald-400 font-mono">
                {users.filter((u: User) => ['swimmer', 'diver', 'captain'].includes(u.role)).length}
              </div>
              <div className="text-[10px] text-slate-300 font-semibold mt-0.5">Athletes</div>
            </div>

            <div 
              onClick={() => onNavigateTab('chat')}
              className="cursor-pointer bg-emerald-950/60 hover:bg-emerald-900/80 p-2.5 rounded-2xl border border-emerald-800/50 transition text-center"
            >
              <div className="text-base sm:text-lg font-extrabold text-cyan-400 font-mono">
                6
              </div>
              <div className="text-[10px] text-slate-300 font-semibold mt-0.5">Group Chats</div>
            </div>
          </div>
        </div>
      </div>

      {/* NEXT MEET HERO COUNTDOWN CARD */}
      {nextMeet && (
        <div className="rounded-3xl bg-slate-900 border border-emerald-700/60 p-4 sm:p-5 shadow-xl text-slate-100 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-sm">
                🏊
              </div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Next Swim &amp; Dive Meet
              </span>
            </div>

            {nextMeet.isHome ? (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                HOME MEET
              </span>
            ) : (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <Bus className="w-3 h-3" /> AWAY MEET
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
            {nextMeet.title}
          </h3>

          {/* Location & Time info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{nextMeet.date} • {nextMeet.startTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="truncate">{nextMeet.location}</span>
            </div>
          </div>

          {nextMeet.warmupTime && (
            <div className="mt-2 text-[11px] text-emerald-300 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Warmup: <span className="font-bold text-white">{nextMeet.warmupTime}</span>
              {nextMeet.busDepartureTime && (
                <span className="text-amber-300 ml-2 font-bold">• Bus: {nextMeet.busDepartureTime}</span>
              )}
            </div>
          )}

          {/* Live Countdown Timer */}
          <div className="mt-3 p-3 bg-slate-950/90 rounded-2xl border border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Countdown to Meet:</span>
            <div className="flex items-center gap-2 font-mono font-bold text-amber-300 text-xs sm:text-sm">
              <span className="bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">{timeLeft.days}d</span>
              <span>:</span>
              <span className="bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">{timeLeft.hours}h</span>
              <span>:</span>
              <span className="bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">{timeLeft.minutes}m</span>
            </div>
          </div>

          {/* RSVP ACTION STRIP */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200">
                Your Meet Attendance (RSVP):
              </span>
              {myNextMeetRSVP && (
                <span className={`text-[11px] font-bold capitalize ${
                  myNextMeetRSVP === 'going' ? 'text-emerald-400' : myNextMeetRSVP === 'excused' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  Status: {myNextMeetRSVP === 'going' ? 'Confirmed Going' : myNextMeetRSVP}
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleRSVPWithConfetti(nextMeet.id, 'going')}
                className={`py-2 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition ${
                  myNextMeetRSVP === 'going'
                    ? 'bg-emerald-600 text-white shadow-lg border border-amber-300 scale-102'
                    : 'bg-slate-800 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Going!</span>
              </button>

              <button
                onClick={() => setRSVP(nextMeet.id, 'excused', 'Late/Excused')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  myNextMeetRSVP === 'excused'
                    ? 'bg-amber-600 text-white shadow-md border border-amber-300'
                    : 'bg-slate-800 hover:bg-amber-950 text-slate-300 hover:text-amber-300 border border-slate-700'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Late / Excused</span>
              </button>

              <button
                onClick={() => setRSVP(nextMeet.id, 'not_going', 'Cannot attend')}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  myNextMeetRSVP === 'not_going'
                    ? 'bg-rose-700 text-white shadow-md border border-rose-400'
                    : 'bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 border border-slate-700'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Can't Go</span>
              </button>
            </div>

            {/* Admin Attendance link */}
            {isAdmin && (
              <div className="mt-3 text-right">
                <button
                  onClick={() => onOpenAttendance && onOpenAttendance(nextMeet.id)}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" /> View Coach Attendance Roster ({Object.values(nextMeet.rsvps).filter((r: RSVPRecord) => r.status === 'going').length} Going) ➔
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* PINNED ANNOUNCEMENTS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" /> Team Announcements
          </h3>
          <span className="text-[11px] text-slate-400">Coaching Staff</span>
        </div>

        {announcements.map((anc: TeamAnnouncement) => (
          <div 
            key={anc.id}
            className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-emerald-800/40 shadow-md space-y-1.5 hover:border-emerald-700 transition"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                {anc.pinned && <span className="text-amber-400">📌</span>}
                {anc.title}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{anc.date}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {anc.content}
            </p>
            <div className="text-[10px] text-emerald-300 font-medium flex items-center gap-1 pt-1 border-t border-slate-800">
              <span>Posted by {anc.authorName} ({anc.authorRole.replace('_', ' ')})</span>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK SHORTCUTS & TEAM RESOURCES */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => onNavigateTab('roster')}
          className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-700 text-left transition shadow-sm group"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-300 flex items-center justify-center mb-2 border border-emerald-800">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xs font-bold text-white group-hover:text-amber-300 transition">
            Parent &amp; Emergency Directory
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Quick 1-tap call/SMS to parents
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('chat')}
          className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-700 text-left transition shadow-sm group"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-950 text-amber-300 flex items-center justify-center mb-2 border border-amber-800">
            <MessageSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xs font-bold text-white group-hover:text-amber-300 transition">
            Girls Squad &amp; Socials
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Carpools, food &amp; spirit themes
          </p>
        </button>
      </div>

    </div>
  );
};
