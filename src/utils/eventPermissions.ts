import { type User, type TeamEvent, type EventType } from '../types';

export type UserDiscipline = 'swimmer' | 'diver' | 'all';

/**
 * Returns whether a user is categorized as a Swimmer, Diver, or All (Coach/Manager).
 */
export const getUserDiscipline = (user: User | null): UserDiscipline => {
  if (!user) return 'all';

  if (user.role === 'head_coach' || user.role === 'assistant_coach' || user.role === 'manager') {
    return 'all';
  }

  if (user.role === 'diving_coach' || user.role === 'diver' || user.athleteType === 'diver') {
    return 'diver';
  }

  if (user.role === 'swimmer' || user.athleteType === 'swimmer') {
    return 'swimmer';
  }

  if (user.role === 'captain') {
    if (user.athleteType === 'diver' || user.events?.some(e => e.toLowerCase().includes('diving'))) {
      return 'diver';
    }
    return 'swimmer';
  }

  return 'all';
};

/**
 * Determines whether the current user is allowed to view a specific event.
 * - Socials (get-togethers) are visible to EVERY athlete and coach.
 * - Swimmers can only see Swimmers Meets, Swimmers Practices, and Socials.
 * - Divers can only see Divers Meets, Divers Practices, and Socials.
 * - Coaches & Managers can see all events.
 */
export const isUserAllowedToViewEvent = (user: User | null, event: TeamEvent): boolean => {
  // All athletes and coaches can see get-togethers
  if (event.type === 'social') {
    return true;
  }

  const discipline = getUserDiscipline(user);

  if (discipline === 'all') {
    return true;
  }

  if (discipline === 'swimmer') {
    return (
      event.type === 'swimmers_meet' ||
      event.type === 'swimmers_practice' ||
      event.type === 'meet' ||
      event.type === 'practice'
    );
  }

  if (discipline === 'diver') {
    return (
      event.type === 'divers_meet' ||
      event.type === 'divers_practice'
    );
  }

  return true;
};

/**
 * Filter list of events based on user's discipline (Swimmer vs Diver)
 */
export const filterEventsForUser = (events: TeamEvent[], user: User | null): TeamEvent[] => {
  return events.filter(event => isUserAllowedToViewEvent(user, event));
};

/**
 * Returns whether a target athlete should be expected in attendance for an event.
 */
export const isAthleteApplicableForEvent = (athlete: User, eventType: EventType): boolean => {
  if (eventType === 'social') return true;

  const athleteDiscipline = getUserDiscipline(athlete);

  if (eventType === 'swimmers_meet' || eventType === 'swimmers_practice' || eventType === 'meet' || eventType === 'practice') {
    return athleteDiscipline === 'swimmer';
  }

  if (eventType === 'divers_meet' || eventType === 'divers_practice') {
    return athleteDiscipline === 'diver';
  }

  return true;
};
