import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  writeBatch,
  getDocs,
  type Unsubscribe 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { 
  type User, 
  type TeamEvent, 
  type ChatChannel, 
  type ChatMessage, 
  type TeamAnnouncement,
  type TeamDocument,
  type RSVPRecord 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_EVENTS, 
  INITIAL_CHANNELS, 
  INITIAL_MESSAGES, 
  INITIAL_ANNOUNCEMENTS,
  INITIAL_DOCUMENTS 
} from '../data/seedData';

// Collection Names
export const COLLECTIONS = {
  USERS: 'users',
  EVENTS: 'events',
  CHANNELS: 'channels',
  MESSAGES: 'messages',
  ANNOUNCEMENTS: 'announcements',
  DOCUMENTS: 'documents'
};

/* =========================================================================
   REAL-TIME SUBSCRIPTIONS
========================================================================= */

export const subscribeToUsers = (onUpdate: (users: User[]) => void): Unsubscribe | null => {
  if (!db || !isFirebaseConfigured()) return null;

  const q = collection(db, COLLECTIONS.USERS);
  return onSnapshot(q, (snapshot) => {
    const users: User[] = [];
    snapshot.forEach((docSnap) => {
      users.push(docSnap.data() as User);
    });
    if (users.length > 0) {
      onUpdate(users);
    }
  }, (error) => {
    console.error('Firestore Users subscription error:', error);
  });
};

export const subscribeToEvents = (onUpdate: (events: TeamEvent[]) => void): Unsubscribe | null => {
  if (!db || !isFirebaseConfigured()) return null;

  const q = query(collection(db, COLLECTIONS.EVENTS), orderBy('date', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const events: TeamEvent[] = [];
    snapshot.forEach((docSnap) => {
      events.push(docSnap.data() as TeamEvent);
    });
    if (events.length > 0) {
      onUpdate(events);
    }
  }, (error) => {
    console.error('Firestore Events subscription error:', error);
  });
};

export const subscribeToChannels = (onUpdate: (channels: ChatChannel[]) => void): Unsubscribe | null => {
  if (!db || !isFirebaseConfigured()) return null;

  const q = collection(db, COLLECTIONS.CHANNELS);
  return onSnapshot(q, (snapshot) => {
    const channels: ChatChannel[] = [];
    snapshot.forEach((docSnap) => {
      channels.push(docSnap.data() as ChatChannel);
    });
    if (channels.length > 0) {
      onUpdate(channels);
    }
  }, (error) => {
    console.error('Firestore Channels subscription error:', error);
  });
};

export const subscribeToMessages = (onUpdate: (messages: ChatMessage[]) => void): Unsubscribe | null => {
  if (!db || !isFirebaseConfigured()) return null;

  const q = query(collection(db, COLLECTIONS.MESSAGES), orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const messages: ChatMessage[] = [];
    snapshot.forEach((docSnap) => {
      messages.push(docSnap.data() as ChatMessage);
    });
    if (messages.length > 0) {
      onUpdate(messages);
    }
  }, (error) => {
    console.error('Firestore Messages subscription error:', error);
  });
};

export const subscribeToAnnouncements = (onUpdate: (announcements: TeamAnnouncement[]) => void): Unsubscribe | null => {
  if (!db || !isFirebaseConfigured()) return null;

  const q = collection(db, COLLECTIONS.ANNOUNCEMENTS);
  return onSnapshot(q, (snapshot) => {
    const announcements: TeamAnnouncement[] = [];
    snapshot.forEach((docSnap) => {
      announcements.push(docSnap.data() as TeamAnnouncement);
    });
    if (announcements.length > 0) {
      onUpdate(announcements);
    }
  }, (error) => {
    console.error('Firestore Announcements subscription error:', error);
  });
};

export const subscribeToDocuments = (onUpdate: (documents: TeamDocument[]) => void): Unsubscribe | null => {
  if (!db || !isFirebaseConfigured()) return null;

  const q = collection(db, COLLECTIONS.DOCUMENTS);
  return onSnapshot(q, (snapshot) => {
    const documents: TeamDocument[] = [];
    snapshot.forEach((docSnap) => {
      documents.push(docSnap.data() as TeamDocument);
    });
    if (documents.length > 0) {
      onUpdate(documents);
    }
  }, (error) => {
    console.error('Firestore Documents subscription error:', error);
  });
};

/* =========================================================================
   MUTATIONS / WRITES
========================================================================= */

export const saveUserToFirestore = async (user: User): Promise<void> => {
  if (!db || !isFirebaseConfigured()) return;
  await setDoc(doc(db, COLLECTIONS.USERS, user.id), user, { merge: true });
};

export const deleteUserFromFirestore = async (userId: string): Promise<void> => {
  if (!db || !isFirebaseConfigured()) return;
  await deleteDoc(doc(db, COLLECTIONS.USERS, userId));
};

export const saveEventToFirestore = async (event: TeamEvent): Promise<void> => {
  if (!db || !isFirebaseConfigured()) return;
  await setDoc(doc(db, COLLECTIONS.EVENTS, event.id), event, { merge: true });
};

export const deleteEventFromFirestore = async (eventId: string): Promise<void> => {
  if (!db || !isFirebaseConfigured()) return;
  await deleteDoc(doc(db, COLLECTIONS.EVENTS, eventId));
};

export const saveRSVPToFirestore = async (
  eventId: string, 
  userId: string, 
  rsvpRecord: RSVPRecord
): Promise<void> => {
  if (!db || !isFirebaseConfigured()) return;
  const eventRef = doc(db, COLLECTIONS.EVENTS, eventId);
  await setDoc(eventRef, {
    rsvps: {
      [userId]: rsvpRecord
    }
  }, { merge: true });
};

export const saveMessageToFirestore = async (message: ChatMessage): Promise<void> => {
  if (!db || !isFirebaseConfigured()) return;
  await setDoc(doc(db, COLLECTIONS.MESSAGES, message.id), message);
};

export const saveReactionToFirestore = async (
  messageId: string, 
  reactions: Record<string, string[]>
): Promise<void> => {
  if (!db || !isFirebaseConfigured()) return;
  const msgRef = doc(db, COLLECTIONS.MESSAGES, messageId);
  await setDoc(msgRef, { reactions }, { merge: true });
};

export const saveChannelToFirestore = async (channel: ChatChannel): Promise<void> => {
  if (!db || !isFirebaseConfigured()) return;
  await setDoc(doc(db, COLLECTIONS.CHANNELS, channel.id), channel);
};

export const saveDocumentToFirestore = async (document: TeamDocument): Promise<void> => {
  if (!db || !isFirebaseConfigured()) return;
  await setDoc(doc(db, COLLECTIONS.DOCUMENTS, document.id), document, { merge: true });
};

export const deleteDocumentFromFirestore = async (documentId: string): Promise<void> => {
  if (!db || !isFirebaseConfigured()) return;
  await deleteDoc(doc(db, COLLECTIONS.DOCUMENTS, documentId));
};

/* =========================================================================
   SEEDING & INITIALIZATION
========================================================================= */

export const seedFirestoreDatabase = async (): Promise<{ success: boolean; message: string }> => {
  if (!db || !isFirebaseConfigured()) {
    return { 
      success: false, 
      message: 'Firebase is not yet configured. Please fill in your .env credentials.' 
    };
  }

  try {
    const batch = writeBatch(db);

    // Seed Users
    INITIAL_USERS.forEach((u) => {
      const ref = doc(db!, COLLECTIONS.USERS, u.id);
      batch.set(ref, u);
    });

    // Seed Events
    INITIAL_EVENTS.forEach((e) => {
      const ref = doc(db!, COLLECTIONS.EVENTS, e.id);
      batch.set(ref, e);
    });

    // Seed Channels
    INITIAL_CHANNELS.forEach((c) => {
      const ref = doc(db!, COLLECTIONS.CHANNELS, c.id);
      batch.set(ref, c);
    });

    // Seed Messages
    INITIAL_MESSAGES.forEach((m) => {
      const ref = doc(db!, COLLECTIONS.MESSAGES, m.id);
      batch.set(ref, m);
    });

    // Seed Announcements
    INITIAL_ANNOUNCEMENTS.forEach((a) => {
      const ref = doc(db!, COLLECTIONS.ANNOUNCEMENTS, a.id);
      batch.set(ref, a);
    });

    // Seed Documents & Policies
    INITIAL_DOCUMENTS.forEach((docItem) => {
      const ref = doc(db!, COLLECTIONS.DOCUMENTS, docItem.id);
      batch.set(ref, docItem);
    });

    await batch.commit();

    return { 
      success: true, 
      message: 'Successfully seeded Cloud Firestore with Aqua Mustangs roster, events, chats & Knowledge Hub policies!' 
    };
  } catch (err: any) {
    console.error('Failed to seed Firestore:', err);
    return { 
      success: false, 
      message: `Error seeding Firestore: ${err?.message || err}` 
    };
  }
};

export const checkFirestoreIsEmpty = async (): Promise<boolean> => {
  if (!db || !isFirebaseConfigured()) return false;
  try {
    const snap = await getDocs(collection(db, COLLECTIONS.USERS));
    return snap.empty;
  } catch {
    return false;
  }
};

export const eraseAllFirestoreData = async (keepUser?: User): Promise<{ success: boolean; message: string }> => {
  if (!db || !isFirebaseConfigured()) {
    return { success: true, message: 'Local storage data cleared.' };
  }

  try {
    const batch = writeBatch(db);

    // Fetch and delete all users except current admin
    const userDocs = await getDocs(collection(db, COLLECTIONS.USERS));
    userDocs.forEach((d) => {
      if (!keepUser || d.id !== keepUser.id) {
        batch.delete(d.ref);
      }
    });

    // Delete all events
    const eventDocs = await getDocs(collection(db, COLLECTIONS.EVENTS));
    eventDocs.forEach((d) => batch.delete(d.ref));

    // Delete all messages
    const msgDocs = await getDocs(collection(db, COLLECTIONS.MESSAGES));
    msgDocs.forEach((d) => batch.delete(d.ref));

    // Delete all announcements
    const annDocs = await getDocs(collection(db, COLLECTIONS.ANNOUNCEMENTS));
    annDocs.forEach((d) => batch.delete(d.ref));

    // Delete all documents
    const docDocs = await getDocs(collection(db, COLLECTIONS.DOCUMENTS));
    docDocs.forEach((d) => batch.delete(d.ref));

    // If keepUser specified, ensure they exist
    if (keepUser) {
      batch.set(doc(db, COLLECTIONS.USERS, keepUser.id), keepUser);
    }

    await batch.commit();

    return { 
      success: true, 
      message: 'All sample data erased from Cloud Firestore. Your database is now a clean slate!' 
    };
  } catch (err: any) {
    console.error('Failed to erase Firestore data:', err);
    return {
      success: false,
      message: `Failed to erase Firestore: ${err?.message || err}`
    };
  }
};

export const saveTeamCredentialsToFirestore = async (teamPasscode: string, adminPin: string): Promise<void> => {
  if (!db || !isFirebaseConfigured()) return;
  const settingsRef = doc(db, 'settings', 'auth');
  await setDoc(settingsRef, { teamPasscode, adminPin, updatedAt: new Date().toISOString() }, { merge: true });
};

export const subscribeToTeamCredentials = (
  onUpdate: (data: { teamPasscode?: string; adminPin?: string }) => void
): Unsubscribe | null => {
  if (!db || !isFirebaseConfigured()) return null;
  const settingsRef = doc(db, 'settings', 'auth');
  return onSnapshot(settingsRef, (snap) => {
    if (snap.exists()) {
      onUpdate(snap.data() as { teamPasscode?: string; adminPin?: string });
    }
  });
};

