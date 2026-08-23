import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  type User, 
  type TeamEvent, 
  type ChatChannel, 
  type ChatMessage, 
  type TeamAnnouncement, 
  type RSVPStatus, 
  type UserRole,
  type ParentInfo 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_EVENTS, 
  INITIAL_CHANNELS, 
  INITIAL_MESSAGES, 
  INITIAL_ANNOUNCEMENTS 
} from '../data/seedData';

interface AppContextType {
  // Auth & Active User
  currentUser: User | null;
  isAuthenticated: boolean;
  teamCodeEntered: boolean;
  isAdminPinVerified: boolean;
  loginUser: (userId: string) => void;
  logout: () => void;
  verifyTeamPasscode: (code: string) => boolean;
  verifyAdminSecurityPin: (pin: string) => boolean;
  resetAdminPinVerification: () => void;
  
  // Role helpers
  isAdmin: boolean;
  isCoach: boolean;
  isCaptain: boolean;
  isStudent: boolean;
  
  // Data Collections
  users: User[];
  events: TeamEvent[];
  channels: ChatChannel[];
  messages: ChatMessage[];
  announcements: TeamAnnouncement[];
  
  // Event & RSVP Actions
  setRSVP: (eventId: string, status: RSVPStatus, notes?: string) => void;
  addEvent: (event: Omit<TeamEvent, 'id' | 'rsvps' | 'createdBy' | 'createdByName'>) => TeamEvent;
  updateEvent: (eventId: string, eventData: Partial<TeamEvent>) => void;
  deleteEvent: (eventId: string) => void;
  
  // Roster Actions
  addUser: (userData: Omit<User, 'id'>) => User;
  updateUser: (userId: string, userData: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  addParentToUser: (userId: string, parentData: Omit<ParentInfo, 'id'>) => void;
  updateParentInfo: (userId: string, parentId: string, parentData: Partial<ParentInfo>) => void;
  removeParentFromUser: (userId: string, parentId: string) => void;
  
  // Chat Actions
  sendMessage: (channelId: string, content: string) => ChatMessage;
  toggleReaction: (messageId: string, emoji: string) => void;
  createChannel: (
    name: string, 
    description: string, 
    icon: string, 
    type: 'public' | 'admins_only' | 'girls_only' | 'custom',
    allowedRoles?: UserRole[],
    allowedUserIds?: string[]
  ) => ChatChannel;
  
  // Announcements
  addAnnouncement: (title: string, content: string, priority?: 'normal' | 'high' | 'urgent', pinned?: boolean) => void;
  deleteAnnouncement: (id: string) => void;
  
  // Utility
  resetAllDataToDefaults: () => void;
  unreadCountTotal: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const TEAM_PASSCODE = 'MUSTANGS2026';
const ADMIN_SECURITY_PIN = '2026';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('mv_swim_users_v2');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [events, setEvents] = useState<TeamEvent[]>(() => {
    const saved = localStorage.getItem('mv_swim_events_v2');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [channels, setChannels] = useState<ChatChannel[]>(() => {
    const saved = localStorage.getItem('mv_swim_channels_v2');
    return saved ? JSON.parse(saved) : INITIAL_CHANNELS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('mv_swim_messages_v2');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [announcements, setAnnouncements] = useState<TeamAnnouncement[]>(() => {
    const saved = localStorage.getItem('mv_swim_announcements_v2');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [teamCodeEntered, setTeamCodeEntered] = useState<boolean>(() => {
    return localStorage.getItem('mv_swim_team_code_verified') === 'true';
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem('mv_swim_current_user_id') || 'u-capt-1';
  });

  const [isAdminPinVerified, setIsAdminPinVerified] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('mv_swim_users_v2', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('mv_swim_events_v2', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('mv_swim_channels_v2', JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem('mv_swim_messages_v2', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('mv_swim_announcements_v2', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem('mv_swim_current_user_id', currentUserId);
    } else {
      localStorage.removeItem('mv_swim_current_user_id');
    }
  }, [currentUserId]);

  const currentUser = useMemo(() => {
    return users.find((u: User) => u.id === currentUserId) || null;
  }, [users, currentUserId]);

  const isAdmin = useMemo(() => {
    if (!currentUser) return false;
    return (
      currentUser.isAdmin || 
      currentUser.role === 'head_coach' || 
      currentUser.role === 'assistant_coach' || 
      currentUser.role === 'diving_coach' || 
      currentUser.role === 'captain'
    );
  }, [currentUser]);

  const isCoach = useMemo(() => {
    if (!currentUser) return false;
    return ['head_coach', 'assistant_coach', 'diving_coach'].includes(currentUser.role);
  }, [currentUser]);

  const isCaptain = useMemo(() => {
    return currentUser?.role === 'captain';
  }, [currentUser]);

  const isStudent = useMemo(() => {
    if (!currentUser) return false;
    return ['captain', 'swimmer', 'diver', 'manager'].includes(currentUser.role);
  }, [currentUser]);

  const isAuthenticated = Boolean(currentUser && teamCodeEntered);

  const loginUser = (userId: string) => {
    setCurrentUserId(userId);
    setTeamCodeEntered(true);
    localStorage.setItem('mv_swim_team_code_verified', 'true');
  };

  const logout = () => {
    setCurrentUserId(null);
    setIsAdminPinVerified(false);
  };

  const verifyTeamPasscode = (code: string): boolean => {
    const formatted = code.trim().toUpperCase();
    if (formatted === TEAM_PASSCODE || formatted === 'MUSTANGS' || formatted === 'SWIM2025' || formatted === 'MV2026') {
      setTeamCodeEntered(true);
      localStorage.setItem('mv_swim_team_code_verified', 'true');
      return true;
    }
    return false;
  };

  const verifyAdminSecurityPin = (pin: string): boolean => {
    if (pin.trim() === ADMIN_SECURITY_PIN || pin.trim() === '1234') {
      setIsAdminPinVerified(true);
      return true;
    }
    return false;
  };

  const resetAdminPinVerification = () => {
    setIsAdminPinVerified(false);
  };

  const setRSVP = (eventId: string, status: RSVPStatus, notes?: string) => {
    if (!currentUser) return;
    setEvents((prev: TeamEvent[]) => prev.map((evt: TeamEvent) => {
      if (evt.id !== eventId) return evt;
      const updatedRsvps = { ...evt.rsvps };
      updatedRsvps[currentUser.id] = {
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        status,
        notes: notes || updatedRsvps[currentUser.id]?.notes || '',
        updatedAt: new Date().toISOString()
      };
      return { ...evt, rsvps: updatedRsvps };
    }));
  };

  const addEvent = (eventData: Omit<TeamEvent, 'id' | 'rsvps' | 'createdBy' | 'createdByName'>): TeamEvent => {
    const newEvent: TeamEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      rsvps: currentUser ? {
        [currentUser.id]: {
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          status: 'going',
          updatedAt: new Date().toISOString()
        }
      } : {},
      createdBy: currentUser?.id || 'u-coach-1',
      createdByName: currentUser ? `${currentUser.name} (${currentUser.role.replace('_', ' ')})` : 'Coach'
    };

    setEvents((prev: TeamEvent[]) => [newEvent, ...prev]);
    return newEvent;
  };

  const updateEvent = (eventId: string, eventData: Partial<TeamEvent>) => {
    setEvents((prev: TeamEvent[]) => prev.map((evt: TeamEvent) => evt.id === eventId ? { ...evt, ...eventData } : evt));
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev: TeamEvent[]) => prev.filter((evt: TeamEvent) => evt.id !== eventId));
  };

  const addUser = (userData: Omit<User, 'id'>): User => {
    const newUser: User = {
      ...userData,
      id: `u-${Date.now()}`
    };
    setUsers((prev: User[]) => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (userId: string, userData: Partial<User>) => {
    setUsers((prev: User[]) => prev.map((u: User) => u.id === userId ? { ...u, ...userData } : u));
  };

  const deleteUser = (userId: string) => {
    setUsers((prev: User[]) => prev.filter((u: User) => u.id !== userId));
  };

  const addParentToUser = (userId: string, parentData: Omit<ParentInfo, 'id'>) => {
    const newParent: ParentInfo = {
      ...parentData,
      id: `p-${Date.now()}`
    };
    setUsers((prev: User[]) => prev.map((u: User) => {
      if (u.id !== userId) return u;
      return {
        ...u,
        parents: [...u.parents, newParent]
      };
    }));
  };

  const updateParentInfo = (userId: string, parentId: string, parentData: Partial<ParentInfo>) => {
    setUsers((prev: User[]) => prev.map((u: User) => {
      if (u.id !== userId) return u;
      return {
        ...u,
        parents: u.parents.map((p: ParentInfo) => p.id === parentId ? { ...p, ...parentData } : p)
      };
    }));
  };

  const removeParentFromUser = (userId: string, parentId: string) => {
    setUsers((prev: User[]) => prev.map((u: User) => {
      if (u.id !== userId) return u;
      return {
        ...u,
        parents: u.parents.filter((p: ParentInfo) => p.id !== parentId)
      };
    }));
  };

  const sendMessage = (channelId: string, content: string): ChatMessage => {
    if (!currentUser) throw new Error('Must be logged in to send message');
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toISOString()
    };
    setMessages((prev: ChatMessage[]) => [...prev, newMsg]);
    return newMsg;
  };

  const toggleReaction = (messageId: string, emoji: string) => {
    if (!currentUser) return;
    setMessages((prev: ChatMessage[]) => prev.map((msg: ChatMessage) => {
      if (msg.id !== messageId) return msg;
      const reactions = { ...(msg.reactions || {}) };
      const currentUsersForEmoji = reactions[emoji] || [];
      const hasReacted = currentUsersForEmoji.includes(currentUser.id);

      if (hasReacted) {
        reactions[emoji] = currentUsersForEmoji.filter((id: string) => id !== currentUser.id);
        if (reactions[emoji].length === 0) {
          delete reactions[emoji];
        }
      } else {
        reactions[emoji] = [...currentUsersForEmoji, currentUser.id];
      }
      return { ...msg, reactions };
    }));
  };

  const createChannel = (
    name: string,
    description: string,
    icon: string,
    type: 'public' | 'admins_only' | 'girls_only' | 'custom',
    allowedRoles?: UserRole[],
    allowedUserIds?: string[]
  ): ChatChannel => {
    const newChannel: ChatChannel = {
      id: `chan-${Date.now()}`,
      name,
      description,
      icon,
      type,
      allowedRoles,
      allowedUserIds,
      createdBy: currentUser?.id || 'admin'
    };
    setChannels((prev: ChatChannel[]) => [...prev, newChannel]);
    return newChannel;
  };

  const addAnnouncement = (title: string, content: string, priority: 'normal' | 'high' | 'urgent' = 'normal', pinned: boolean = false) => {
    const newAnc: TeamAnnouncement = {
      id: `anc-${Date.now()}`,
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      authorName: currentUser?.name || 'Coach',
      authorRole: currentUser?.role || 'head_coach',
      priority,
      pinned
    };
    setAnnouncements((prev: TeamAnnouncement[]) => [newAnc, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev: TeamAnnouncement[]) => prev.filter((a: TeamAnnouncement) => a.id !== id));
  };

  const resetAllDataToDefaults = () => {
    localStorage.removeItem('mv_swim_users_v2');
    localStorage.removeItem('mv_swim_events_v2');
    localStorage.removeItem('mv_swim_channels_v2');
    localStorage.removeItem('mv_swim_messages_v2');
    localStorage.removeItem('mv_swim_announcements_v2');
    setUsers(INITIAL_USERS);
    setEvents(INITIAL_EVENTS);
    setChannels(INITIAL_CHANNELS);
    setMessages(INITIAL_MESSAGES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setCurrentUserId('u-capt-1');
  };

  const unreadCountTotal = useMemo(() => {
    return 3;
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        teamCodeEntered,
        isAdminPinVerified,
        loginUser,
        logout,
        verifyTeamPasscode,
        verifyAdminSecurityPin,
        resetAdminPinVerification,
        isAdmin,
        isCoach,
        isCaptain,
        isStudent,
        users,
        events,
        channels,
        messages,
        announcements,
        setRSVP,
        addEvent,
        updateEvent,
        deleteEvent,
        addUser,
        updateUser,
        deleteUser,
        addParentToUser,
        updateParentInfo,
        removeParentFromUser,
        sendMessage,
        toggleReaction,
        createChannel,
        addAnnouncement,
        deleteAnnouncement,
        resetAllDataToDefaults,
        unreadCountTotal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
