import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { type User, type UserRole, type ParentInfo } from '../types';
import { 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MessageSquare, 
  Heart, 
  Crown, 
  Download, 
  Cake
} from 'lucide-react';

interface RosterViewProps {
  onSelectAthlete: (user: User) => void;
  onOpenAddAthlete: () => void;
}

export const RosterView: React.FC<RosterViewProps> = ({ onSelectAthlete, onOpenAddAthlete }) => {
  const { users, isAdmin } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');

  const filteredUsers = users.filter((user: User) => {
    // Search query
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.includes(query) ||
      user.parents.some((p: ParentInfo) => p.name.toLowerCase().includes(query) || p.phone.includes(query)) ||
      (user.events && user.events.some((e: string) => e.toLowerCase().includes(query)));

    if (!matchesQuery) return false;

    // Filter Role
    if (filterRole !== 'all') {
      if (filterRole === 'coach' && !user.role.includes('coach')) return false;
      if (filterRole === 'captain' && user.role !== 'captain') return false;
      if (filterRole === 'swimmer' && user.role !== 'swimmer' && user.role !== 'captain') return false;
      if (filterRole === 'diver' && user.role !== 'diver') return false;
    }

    // Filter Grade
    if (filterGrade !== 'all') {
      if (user.grade?.toString() !== filterGrade) return false;
    }

    return true;
  });

  const exportRosterCSV = () => {
    const headers = [
      'Name',
      'Role',
      'Grade',
      'Email',
      'Phone',
      'Birthday',
      'Events',
      'T-Shirt',
      'Emergency Notes',
      'Parent 1 Name',
      'Parent 1 Relationship',
      'Parent 1 Phone',
      'Parent 1 Email',
      'Parent 2 Name',
      'Parent 2 Relationship',
      'Parent 2 Phone',
      'Parent 2 Email'
    ];

    const rows = users.map((u: User) => {
      const p1 = u.parents[0] || ({} as Partial<ParentInfo>);
      const p2 = u.parents[1] || ({} as Partial<ParentInfo>);
      return [
        `"${u.name}"`,
        `"${u.role}"`,
        u.grade || '',
        `"${u.email}"`,
        `"${u.phone}"`,
        `"${u.birthday || ''}"`,
        `"${(u.events || []).join('; ')}"`,
        `"${u.tShirtSize || ''}"`,
        `"${u.emergencyNotes || ''}"`,
        `"${p1.name || ''}"`,
        `"${p1.relationship || ''}"`,
        `"${p1.phone || ''}"`,
        `"${p1.email || ''}"`,
        `"${p2.name || ''}"`,
        `"${p2.relationship || ''}"`,
        `"${p2.phone || ''}"`,
        `"${p2.email || ''}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Aqua_Mustangs_Roster_2026_2027.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'head_coach':
        return <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">HEAD COACH</span>;
      case 'assistant_coach':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">ASST COACH</span>;
      case 'diving_coach':
        return <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">DIVE COACH</span>;
      case 'captain':
        return <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"><Crown className="w-2.5 h-2.5" /> CAPTAIN</span>;
      case 'diver':
        return <span className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">DIVER</span>;
      case 'manager':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">MANAGER</span>;
      default:
        return <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-medium px-2 py-0.5 rounded-full">SWIMMER</span>;
    }
  };

  return (
    <div className="space-y-4 pb-24 pt-2 animate-in fade-in">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Team Roster &amp; Directory</h2>
          <p className="text-xs text-emerald-300">Athletes, coaches, and parent contacts</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={exportRosterCSV}
            title="Export Roster to CSV"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            <Download className="w-4 h-4" />
          </button>

          {isAdmin && (
            <button
              onClick={onOpenAddAthlete}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg border border-amber-400/40 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by athlete name, parent name, stroke, event, or phone..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="space-y-1.5">
        {/* Role Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setFilterRole('all')}
            className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition ${
              filterRole === 'all' ? 'bg-amber-400 text-slate-950 font-extrabold' : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            All Members ({users.length})
          </button>
          <button
            onClick={() => setFilterRole('captain')}
            className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition ${
              filterRole === 'captain' ? 'bg-amber-400 text-slate-950 font-extrabold' : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            👑 Captains
          </button>
          <button
            onClick={() => setFilterRole('swimmer')}
            className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition ${
              filterRole === 'swimmer' ? 'bg-amber-400 text-slate-950 font-extrabold' : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            🏊 Swimmers
          </button>
          <button
            onClick={() => setFilterRole('diver')}
            className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition ${
              filterRole === 'diver' ? 'bg-amber-400 text-slate-950 font-extrabold' : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            🤿 Divers
          </button>
          <button
            onClick={() => setFilterRole('coach')}
            className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition ${
              filterRole === 'coach' ? 'bg-amber-400 text-slate-950 font-extrabold' : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            🛡️ Coaches
          </button>
        </div>

        {/* Grade Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Grade:</span>
          {['all', '12', '11', '10', '9'].map(gr => (
            <button
              key={gr}
              onClick={() => setFilterGrade(gr)}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterGrade === gr ? 'bg-emerald-700 text-white font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              {gr === 'all' ? 'All Grades' : `Gr ${gr}`}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Cards List */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 rounded-3xl border border-slate-800 p-6">
            <p className="text-sm font-bold text-slate-300">No athletes or coaches match your search.</p>
            <p className="text-xs text-slate-500 mt-1">Try searching a different name or clear the filters.</p>
          </div>
        ) : (
          filteredUsers.map((user: User) => {
            return (
              <div
                key={user.id}
                className="p-4 rounded-3xl bg-slate-900 border border-emerald-800/40 hover:border-emerald-600 transition shadow-xl text-slate-100 space-y-3"
              >
                {/* Top Row: Avatar, Name, Role */}
                <div 
                  onClick={() => onSelectAthlete(user)}
                  className="flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img 
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                      alt="" 
                      className="w-12 h-12 rounded-2xl object-cover border border-emerald-700/60 shadow-md flex-shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm sm:text-base font-extrabold text-white truncate hover:text-amber-300 transition">
                          {user.name}
                        </h3>
                        {user.grade && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                            Gr {user.grade}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        {getRoleBadge(user.role)}
                        {user.birthday && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Cake className="w-3 h-3 text-amber-400" />
                            {user.birthday}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAthlete(user);
                    }}
                    className="text-xs font-bold text-emerald-400 hover:text-amber-300 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
                  >
                    View Details
                  </button>
                </div>

                {/* Primary Events Tags */}
                {user.events && user.events.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {user.events.slice(0, 3).map((evt: string, idx: number) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-200 border border-emerald-800/60">
                        {evt}
                      </span>
                    ))}
                    {user.events.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400">
                        +{user.events.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Athlete Direct Contact Row */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`tel:${user.phone}`}
                    className="py-1.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="truncate">{user.phone || 'Athlete Phone'}</span>
                  </a>

                  <a
                    href={`mailto:${user.email}`}
                    className="py-1.5 px-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate">Email</span>
                  </a>
                </div>

                {/* PARENT & EMERGENCY CONTACT SUMMARY */}
                {user.parents && user.parents.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1 mb-1.5">
                      <Heart className="w-3 h-3 text-rose-400" /> Parents &amp; Emergency Contacts:
                    </div>

                    <div className="space-y-1.5">
                      {user.parents.map((parent: ParentInfo) => (
                        <div 
                          key={parent.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800/60 text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-bold text-white truncate">{parent.name}</span>
                            <span className="text-[10px] text-slate-400 ml-1">({parent.relationship})</span>
                            <div className="text-[11px] text-slate-400 font-mono">{parent.phone}</div>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <a
                              href={`tel:${parent.phone}`}
                              title={`Call ${parent.name}`}
                              className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition"
                            >
                              <Phone className="w-3 h-3" />
                            </a>
                            <a
                              href={`sms:${parent.phone}`}
                              title={`Text ${parent.name}`}
                              className="p-1.5 rounded-lg bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 transition"
                            >
                              <MessageSquare className="w-3 h-3" />
                            </a>
                            {parent.email && (
                              <a
                                href={`mailto:${parent.email}`}
                                title={`Email ${parent.name}`}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition"
                              >
                                <Mail className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
