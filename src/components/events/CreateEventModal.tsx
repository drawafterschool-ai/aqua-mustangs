import React, { useState } from 'react';
import { type TeamEvent, type EventType } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Bus, Sparkles } from 'lucide-react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEvent?: TeamEvent;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, initialEvent }) => {
  const { addEvent, updateEvent, isAdmin, currentUser } = useApp();

  const [title, setTitle] = useState(initialEvent?.title || (isAdmin ? '' : 'Team Pasta Party 🍝'));
  const [type, setType] = useState<EventType>(initialEvent?.type || (isAdmin ? 'swimmers_meet' : 'social'));
  const [date, setDate] = useState(initialEvent?.date || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(initialEvent?.startTime || (isAdmin ? '15:30' : '18:00'));
  const [endTime, setEndTime] = useState(initialEvent?.endTime || (isAdmin ? '18:00' : '20:30'));
  const [location, setLocation] = useState(
    initialEvent?.location || (isAdmin ? 'Mounds View High School Natatorium' : `${currentUser?.name.split(' ')[0] || 'Host'}’s House (Address)`)
  );
  const [isHome, setIsHome] = useState<boolean>(initialEvent?.isHome ?? true);
  const [opponent, setOpponent] = useState(initialEvent?.opponent || '');
  const [busDepartureTime, setBusDepartureTime] = useState(initialEvent?.busDepartureTime || '');
  const [warmupTime, setWarmupTime] = useState(initialEvent?.warmupTime || '15:45');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [snackVolunteer, setSnackVolunteer] = useState(initialEvent?.snackVolunteer || '');

  if (!isOpen) return null;

  const isMeet = type === 'swimmers_meet' || type === 'divers_meet' || type === 'meet';
  const isPractice = type === 'swimmers_practice' || type === 'divers_practice' || type === 'practice';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalType: EventType = isAdmin ? type : 'social';

    if (initialEvent) {
      updateEvent(initialEvent.id, {
        title,
        type: finalType,
        date,
        startTime,
        endTime,
        location,
        isHome: isMeet ? isHome : undefined,
        opponent: isMeet ? opponent : undefined,
        busDepartureTime: isMeet && !isHome ? busDepartureTime : undefined,
        warmupTime: isMeet || isPractice ? warmupTime : undefined,
        description,
        snackVolunteer
      });
    } else {
      addEvent({
        title,
        type: finalType,
        date,
        startTime,
        endTime,
        location,
        isHome: isMeet ? isHome : undefined,
        opponent: isMeet ? opponent : undefined,
        busDepartureTime: isMeet && !isHome ? busDepartureTime : undefined,
        warmupTime: isMeet || isPractice ? warmupTime : undefined,
        description,
        snackVolunteer
      });
    }

    onClose();
  };

  const getHeaderIcon = () => {
    switch (type) {
      case 'swimmers_meet':
      case 'meet': return '🏊';
      case 'divers_meet': return '🤿';
      case 'swimmers_practice':
      case 'practice': return '⏱️';
      case 'divers_practice': return '🤸';
      case 'social': return '🍝';
      default: return '📅';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-700/60 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#06241b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 font-bold text-sm">
              {getHeaderIcon()}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {initialEvent 
                  ? 'Edit Team Event' 
                  : isAdmin 
                    ? 'Schedule New Event' 
                    : 'Plan Team Social / Get-Together'}
              </h3>
              <p className="text-[11px] text-emerald-300">
                {isAdmin ? 'Coaches & Captains Admin Control' : 'Aqua Mustangs Athlete Social Planner'}
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

        {/* Athlete Notice for Socials */}
        {!isAdmin && (
          <div className="p-3 bg-amber-950/40 border-b border-amber-800/40 px-4 flex items-center gap-2 text-xs text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>Athlete Access:</strong> You can schedule pasta parties, carpools, breakfasts, and team bonding socials. Meets and practices are scheduled by coaches.
            </span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Event Category Selector */}
          {isAdmin ? (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Event Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                
                {/* Swimmers Meet */}
                <button
                  type="button"
                  onClick={() => {
                    setType('swimmers_meet');
                    if (!title || title.includes('Practice') || title.includes('Pasta') || title.includes('Diving')) setTitle('Swimmers Dual Meet vs ');
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${
                    type === 'swimmers_meet' || type === 'meet'
                      ? 'bg-emerald-800 text-amber-300 border-amber-400/60 shadow-sm' 
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="text-base">🏊</span>
                  <span>Swimmers Meet</span>
                </button>

                {/* Divers Meet */}
                <button
                  type="button"
                  onClick={() => {
                    setType('divers_meet');
                    if (!title || title.includes('Practice') || title.includes('Pasta') || title.includes('Dual')) setTitle('Divers Invitational Meet 🤿');
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${
                    type === 'divers_meet'
                      ? 'bg-cyan-900 text-amber-300 border-amber-400/60 shadow-sm' 
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="text-base">🤿</span>
                  <span>Divers Meet</span>
                </button>

                {/* Swimmers Practice */}
                <button
                  type="button"
                  onClick={() => {
                    setType('swimmers_practice');
                    if (!title || title.includes('Meet') || title.includes('Pasta') || title.includes('Diving')) setTitle('Swimmers Afternoon Practice');
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${
                    type === 'swimmers_practice' || type === 'practice'
                      ? 'bg-emerald-800 text-amber-300 border-amber-400/60 shadow-sm' 
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="text-base">⏱️</span>
                  <span>Swimmers Practice</span>
                </button>

                {/* Divers Practice */}
                <button
                  type="button"
                  onClick={() => {
                    setType('divers_practice');
                    if (!title || title.includes('Meet') || title.includes('Pasta') || title.includes('Swimmers')) setTitle('Divers Springboard Practice 🤸');
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition ${
                    type === 'divers_practice'
                      ? 'bg-purple-900 text-amber-300 border-amber-400/60 shadow-sm' 
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="text-base">🤸</span>
                  <span>Divers Practice</span>
                </button>

                {/* Social */}
                <button
                  type="button"
                  onClick={() => {
                    setType('social');
                    if (!title || title.includes('Meet') || title.includes('Practice')) setTitle('Team Pasta Party 🍝');
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border col-span-2 sm:col-span-1 transition ${
                    type === 'social' 
                      ? 'bg-amber-800 text-amber-300 border-amber-400/60 shadow-sm' 
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span className="text-base">🍝</span>
                  <span>Get-Together</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍝</span>
                <div>
                  <div className="text-xs font-bold text-amber-400">Team Get-Together / Social</div>
                  <div className="text-[10px] text-slate-400">Pasta party, team dinner, breakfast, senior night bonding</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-700">
                Social Event
              </span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isAdmin ? 'Event Title *' : 'Social Title *'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={isAdmin ? "e.g. Swimmers Dual Meet vs Stillwater / Divers Practice" : "e.g. Pre-Meet Pasta Party at Miller House 🍝"}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Date & Times */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Meet Specifics (Admin Only) */}
          {isAdmin && isMeet && (
            <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-slate-300">Venue:</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsHome(true);
                      setLocation('Mounds View High School Natatorium');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      isHome ? 'bg-emerald-700 text-white border border-amber-400' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Home Meet
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsHome(false);
                      setLocation('');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      !isHome ? 'bg-emerald-700 text-white border border-amber-400' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Away Meet
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Opponent School</label>
                  <input
                    type="text"
                    value={opponent}
                    onChange={e => setOpponent(e.target.value)}
                    placeholder="e.g. Stillwater, Woodbury, East Ridge"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Warmup Time</label>
                  <input
                    type="text"
                    value={warmupTime}
                    onChange={e => setWarmupTime(e.target.value)}
                    placeholder="e.g. 15:45 (Swimmers) / 15:15 (Divers)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {!isHome && (
                <div>
                  <label className="block text-xs font-bold text-amber-400 mb-1 flex items-center gap-1">
                    <Bus className="w-3.5 h-3.5" /> Bus Departure Time (Door 1)
                  </label>
                  <input
                    type="text"
                    value={busDepartureTime}
                    onChange={e => setBusDepartureTime(e.target.value)}
                    placeholder="e.g. 15:45 Bus departure"
                    className="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isAdmin && isMeet ? 'Pool Location / Natatorium Address' : 'Host Address / Location'}
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. 5420 Lakeview Dr, Shoreview, MN or MVHS Pool"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Description & Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {type === 'social' ? 'Food / Dish Assignments & Details' : 'Instructions & Notes'}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={type === 'social' 
                ? "e.g. Seniors (Pasta/Sauce), Juniors (Bread & Salad), Sophomores (Drinks/Fruit), Freshmen (Desserts). Bring swimsuit for hot tub!" 
                : "e.g. Wear Green & Gold spirit ribbons, bring parkas, dive sheets due Wednesday..."}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* Host / Parent Volunteer */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {type === 'social' ? 'Host Athlete / Family Volunteer' : 'Parent Volunteer / Host (Optional)'}
            </label>
            <input
              type="text"
              value={snackVolunteer}
              onChange={e => setSnackVolunteer(e.target.value)}
              placeholder={type === 'social' ? "e.g. The Peterson Family (Host)" : "e.g. Karen Peterson & Hao Nguyen (Snacks & Timing)"}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-extrabold shadow-lg border border-amber-400/40 transition"
            >
              {initialEvent 
                ? 'Save Changes' 
                : isAdmin 
                  ? 'Publish to Team Calendar' 
                  : 'Post Social to Calendar 🍝'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
