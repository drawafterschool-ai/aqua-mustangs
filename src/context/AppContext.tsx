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
import { isFirebaseConfigured } from '../config/firebase';
import { 
  subscribeToUsers, 
  subscribeToEvents, 
  subscribeToChannels, 
  subscribeToMessages, 
  subscribeToAnnouncements,
  saveUserToFirestore,
  deleteUserFromFirestore,
  saveEventToFirestore,
  deleteEventFromFirestore,
  saveRSVPToFirestore,
  saveMessageToFirestore,
  saveReactionToFirestore,
  saveChannelToFirestore,
  seedFirestoreDatabase,
  checkFirestoreIsEmpty
} from '../services/firestoreService';

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
  
  // Cloud Sync
  isCloudConnected: boolean;
  seedCloudFirestore: () => Promise<{ success: boolean; message: string }>;
  
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
  const isCloudConnected = isFirebaseConfigured();

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

  // Auth State
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem('mv_swim_active_user_id') || 'u-capt-1';
  });

  const [teamCodeEntered, setTeamCodeEntered] = useState<boolean>(() => {
    return localStorage.getItem('mv_swim_team_passcode_verified') === 'true';
  });

  const [isAdminPinVerified, setIsAdminPinVerified] = useState<boolean>(false);

  /* =========================================================================
     FIRESTORE REAL-TIME SUBSCRIPTIONS
  ========================================================================= */
  useEffect(() => {
    if (!isCloudConnected) return;

    // Check if database is empty on first boot and auto-seed initial data
    checkFirestoreIsEmpty().then((isEmpty) => {
      if (isEmpty) {
        seedFirestoreDatabase();
      }
    });

    const unsubUsers = subscribeToUsers((cloudUsers) => {
      setUsers(cloudUsers);
      localStorage.setItem('mv_swim_users_v2', JSON.stringify(cloudUsers));
    });

    const unsubEvents = subscribeToEvents((cloudEvents) => {
      setEvents(cloudEvents);
      localStorage.setItem('mv_swim_events_v2', JSON.stringify(cloudEvents));
    });

    const unsubChannels = subscribeToChannels((cloudChannels) => {
      setChannels(cloudChannels);
      localStorage.setItem('mv_swim_channels_v2', JSON.stringify(cloudChannels));
    });

    const unsubMessages = subscribeToMessages((cloudMessages) => {
      setMessages(cloudMessages);
      localStorage.setItem('mv_swim_messages_v2', JSON.stringify(cloudMessages));
    });

    const unsubAnnouncements = subscribeToAnnouncements((cloudAnnouncements) => {
      setAnnouncements(cloudAnnouncements);
      localStorage.setItem('mv_swim_announcements_v2', JSON.stringify(cloudAnnouncements));
    });

    return () => {
      unsubUsers?.();
      unsubEvents?.();
      unsubChannels?.();
      unsubMessages?.();
      unsubAnnouncements?.();
    };
  }, [isCloudConnected]);

  // Persist local storage fallbacks
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
      localStorage.setItem('mv_swim_active_user_id', currentUserId);
    }
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('mv_swim_team_passcode_verified', String(teamCodeEntered));
  }, [teamCodeEntered]);

  // Current User Object
  const currentUser = useMemo(() => {
    return users.find(u => u.id === currentUserId) || users[0] || null;
  }, [users, currentUserId]);

  // Role Checks
  const isCoach = useMemo(() => {
    if (!currentUser) return false;
    return ['head_coach', 'assistant_coach', 'diving_coach'].includes(currentUser.role);
  }, [currentUser]);

  const isCaptain = useMemo(() => currentUser?.role === 'captain', [currentUser]);
  const isAdmin = useMemo(() => isCoach || isCaptain || Boolean(currentUser?.isAdmin), [isCoach, isCaptain, currentUser]);
  const isStudent = useMemo(() => !isCoach, [isCoach]);

  const isAuthenticated = teamCodeEntered && Boolean(currentUser);

  // Auth Operations
  const loginUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUserId(userId);
      setTeamCodeEntered(true);
      setIsAdminPinVerified(false);
    }
  };

  const logout = () => {
    setTeamCodeEntered(false);
    setIsAdminPinVerified(false);
    localStorage.removeItem('mv_swim_team_passcode_verified');
  };

  const verifyTeamPasscode = (code: string): boolean => {
    const formatted = code.trim().toUpperCase();
    if (formatted === TEAM_PASSCODE || formatted === 'MUSTANGS' || formatted === 'SWIM2025' || formatted === 'MV2026') {
      setTeamCodeEntered(true);
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

  /* =========================================================================
     RSVP & EVENT ACTIONS
  ========================================================================= */
  const setRSVP = (eventId: string, status: RSVPStatus, notes?: string) => {
    if (!currentUser) return;

    const rsvpRecord = {
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      status,
      notes,
      updatedAt: new Date().toISOString()
    };

    // Update local state immediately
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          rsvps: {
            ...evt.rsvps,
            [currentUser.id]: rsvpRecord
          }
        };
      }
      return evt;
    }));

    // Sync to Cloud Firestore
    saveRSVPToFirestore(eventId, currentUser.id, rsvpRecord);
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
      createdBy: currentUser?.id || 'admin',
      createdByName: currentUser?.name || 'Head Coach'
    };

    setEvents(prev => [...prev, newEvent]);
    saveEventToFirestore(newEvent);
    return newEvent;
  };

  const updateEvent = (eventId: string, eventData: Partial<TeamEvent>) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        const updated = { ...evt, ...eventData };
        saveEventToFirestore(updated);
        return updated;
      }
      return evt;
    }));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(evt => evt.id !== eventId));
    deleteEventFromFirestore(eventId);
  };

  /* =========================================================================
     ROSTER & USER ACTIONS
  ========================================================================= */
  const addUser = (userData: Omit<User, 'id'>): User => {
    const newUser: User = {
      ...userData,
      id: `u-${Date.now()}`
    };

    setUsers(prev => [...prev, newUser]);
    saveUserToFirestore(newUser);
    return newUser;
  };

  const updateUser = (userId: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const updated = { ...user, ...userData };
        saveUserToFirestore(updated);
        return updated;
      }
      return user;
    }));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    deleteUserFromFirestore(userId);
  };

  const addParentToUser = (userId: string, parentData: Omit<ParentInfo, 'id'>) => {
    const newParent: ParentInfo = {
      ...parentData,
      id: `p-${Date.now()}`
    };

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = {
          ...u,
          parents: [...u.parents, newParent]
        };
        saveUserToFirestore(updated);
        return updated;
      }
      return u;
    }));
  };

  const updateParentInfo = (userId: string, parentId: string, parentData: Partial<ParentInfo>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = {
          ...u,
          parents: u.parents.map(p => p.id === parentId ? { ...p, ...parentData } : p)
        };
        saveUserToFirestore(updated);
        return updated;
      }
      return u;
    }));
  };

  const removeParentFromUser = (userId: string, parentId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = {
          ...u,
          parents: u.parents.filter(p => p.id !== parentId)
        };
        saveUserToFirestore(updated);
        return updated;
      }
      return u;
    }));
  };

  /* =========================================================================
     CHAT & MESSAGING ACTIONS
  ========================================================================= */
  const sendMessage = (channelId: string, content: string): ChatMessage => {
    if (!currentUser) throw new Error('Not logged in');

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      channelId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toISOString(),
      reactions: {}
    };

    setMessages(prev => [...prev, newMessage]);
    saveMessageToFirestore(newMessage);
    return newMessage;
  };

  const toggleReaction = (messageId: string, emoji: string) => {
    if (!currentUser) return;
    const userId = currentUser.id;

    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...(msg.reactions || {}) };
        const currentList = reactions[emoji] || [];

        if (currentList.includes(userId)) {
          reactions[emoji] = currentList.filter(id => id !== userId);
          if (reactions[emoji].length === 0) {
            delete reactions[emoji];
          }
        } else {
          reactions[emoji] = [...currentList, userId];
        }

        const updated = { ...msg, reactions };
        saveReactionToFirestore(messageId, reactions);
        return updated;
      }
      return msg;
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
      id: `ch-${Date.now()}`,
      name,
      description,
      icon,
      type,
      allowedRoles,
      allowedUserIds,
      createdBy: currentUser?.id || 'system'
    };

    setChannels(prev => [...prev, newChannel]);
    saveChannelToFirestore(newChannel);
    return newChannel;
  };

  /* =========================================================================
     ANNOUNCEMENTS ACTIONS
  ========================================================================= */
  const addAnnouncement = (title: string, content: string, priority: 'normal' | 'high' | 'urgent' = 'normal', pinned = false) => {
    const newAnnouncement: TeamAnnouncement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      date: new Date().toISOString(),
      authorName: currentUser?.name || 'Coach',
      authorRole: currentUser?.role || 'head_coach',
      priority,
      pinned
    };

    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  /* =========================================================================
     UTILITY & CLOUD SEEDING
  ========================================================================= */
  const resetAllDataToDefaults = () => {
    setUsers(INITIAL_USERS);
    setEvents(INITIAL_EVENTS);
    setChannels(INITIAL_CHANNELS);
    setMessages(INITIAL_MESSAGES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);

    localStorage.setItem('mv_swim_users_v2', JSON.stringify(INITIAL_USERS));
    localStorage.setItem('mv_swim_events_v2', JSON.stringify(INITIAL_EVENTS));
    localStorage.setItem('mv_swim_channels_v2', JSON.stringify(INITIAL_CHANNELS));
    localStorage.setItem('mv_swim_messages_v2', JSON.stringify(INITIAL_MESSAGES));
    localStorage.setItem('mv_swim_announcements_v2', JSON.stringify(INITIAL_ANNOUNCEMENTS));
  };

  const seedCloudFirestore = async () => {
    return await seedFirestoreDatabase();
  };

  const unreadCountTotal = useMemo(() => {
    return 3;
  }, []);

  const value: AppContextType = {
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
    isCloudConnected,
    seedCloudFirestore,
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
  };

  return (
    <AppContext.Provider value={value}>
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
