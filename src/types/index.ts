export type UserRole = 
  | 'head_coach' 
  | 'assistant_coach' 
  | 'diving_coach' 
  | 'captain' 
  | 'swimmer' 
  | 'diver' 
  | 'manager';

export type AthleteType = 'swimmer' | 'diver';

export interface ParentInfo {
  id: string;
  name: string;
  relationship: string; // 'Mother' | 'Father' | 'Guardian'
  phone: string;
  email: string;
  isPrimary: boolean;
  isEmergencyContact: boolean;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  athleteType?: AthleteType; // Swimmer vs Diver discipline
  grade?: 9 | 10 | 11 | 12; // High School grades
  email: string;
  phone: string;
  birthday: string; // YYYY-MM-DD
  avatar?: string;
  bio?: string;
  events?: string[]; // e.g. ['50 Freestyle', '100 Butterfly', '1M Diving']
  tShirtSize?: 'XS' | 'S' | 'M' | 'L' | 'XL';
  parents: ParentInfo[];
  emergencyNotes?: string;
  isAdmin: boolean; // Coaches and Captains
}

export type EventType = 
  | 'swimmers_meet' 
  | 'divers_meet' 
  | 'swimmers_practice' 
  | 'divers_practice' 
  | 'social'
  | 'meet' 
  | 'practice' 
  | 'dryland' 
  | 'meeting';

export type RSVPStatus = 'going' | 'not_going' | 'excused' | 'pending';

export interface RSVPRecord {
  userId: string;
  userName: string;
  userRole: UserRole;
  status: RSVPStatus;
  notes?: string;
  updatedAt: string;
}

export interface TeamEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (24h or formatted)
  endTime: string;
  location: string;
  isHome?: boolean;
  opponent?: string;
  busDepartureTime?: string;
  warmupTime?: string;
  description?: string;
  snackVolunteer?: string;
  rsvps: Record<string, RSVPRecord>; // keyed by userId
  createdBy: string;
  createdByName?: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
  reactions?: Record<string, string[]>; // emoji -> array of userIds
  isPinned?: boolean;
  isAnnouncement?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or lucide icon key
  type: 'public' | 'admins_only' | 'girls_only' | 'custom';
  allowedRoles?: UserRole[];
  allowedUserIds?: string[];
  createdBy: string;
  isLocked?: boolean; // only admins can post (e.g. Announcements)
}

export interface TeamAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string;
  authorName: string;
  authorRole: UserRole;
  priority: 'normal' | 'high' | 'urgent';
  pinned: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: 'meet' | 'practice' | 'social' | 'chat' | 'announcement';
  read: boolean;
  actionUrl?: string;
}

export type DocumentCategory = 
  | 'handbook_policies' 
  | 'lettering_standards' 
  | 'medical_safety' 
  | 'parent_booster' 
  | 'meet_info';

export interface TeamDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  description: string;
  content: string; // rich markdown / detailed policy text
  externalUrl?: string; // link to PDF or Google Drive
  fileType: 'policy' | 'pdf' | 'doc' | 'sheet' | 'link';
  updatedAt: string;
  isPinned?: boolean;
  author: string;
  tags?: string[];
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  teamCode: string;
  adminPinVerified: boolean;
}
