import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNav, type TabType } from './components/layout/BottomNav';
import { HomeView } from './views/HomeView';
import { ScheduleView } from './views/ScheduleView';
import { RosterView } from './views/RosterView';
import { ChatView } from './views/ChatView';
import { SettingsView } from './views/SettingsView';

import { TeamPasscodeGate } from './components/auth/TeamPasscodeGate';
import { PwaModal } from './components/pwa/PwaModal';
import { EventAttendanceModal } from './components/events/EventAttendanceModal';
import { CreateEventModal } from './components/events/CreateEventModal';
import { AthleteDetailModal } from './components/roster/AthleteDetailModal';
import { EditAthleteModal } from './components/roster/EditAthleteModal';
import { MemberInviteModal } from './components/roster/MemberInviteModal';
import { CreateChannelModal } from './components/chat/CreateChannelModal';
import { NotificationCenterModal } from './components/notifications/NotificationCenterModal';
import { KnowledgeHubModal } from './components/knowledge/KnowledgeHubModal';
import { INITIAL_NOTIFICATIONS } from './services/notificationService';
import { type TeamEvent, type User, type AppNotification } from './types';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, events } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Modals state
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [showKnowledgeHubModal, setShowKnowledgeHubModal] = useState(false);
  const [attendanceEventId, setAttendanceEventId] = useState<string | null>(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TeamEvent | undefined>(undefined);
  const [selectedAthlete, setSelectedAthlete] = useState<User | null>(null);
  const [showEditAthleteModal, setShowEditAthleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  
  // Member invite email modal
  const [inviteModalUser, setInviteModalUser] = useState<User | null>(null);
  const [isNewMemberInvite, setIsNewMemberInvite] = useState(true);

  // Notifications State
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('mv_swim_notifications_v1');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('mv_swim_notifications_v1', JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSelectNotification = (notif: AppNotification) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    if (notif.type === 'meet' || notif.type === 'practice' || notif.type === 'social') {
      setActiveTab('schedule');
      setShowNotificationModal(false);
    } else if (notif.type === 'chat') {
      setActiveTab('chat');
      setShowNotificationModal(false);
    }
  };

  // If not authenticated, show the team passcode gate
  if (!isAuthenticated) {
    return <TeamPasscodeGate />;
  }

  const attendanceEvent = events.find((e: TeamEvent) => e.id === attendanceEventId) || null;

  const handleOpenEditEvent = (event?: TeamEvent) => {
    setEditingEvent(event);
    setShowCreateEvent(true);
  };

  const handleOpenAddAthlete = () => {
    setEditingUser(null);
    setShowEditAthleteModal(true);
  };

  const handleOpenEditAthlete = (user: User) => {
    setEditingUser(user);
    setShowEditAthleteModal(true);
  };

  const handleSendInvite = (user: User, isNew = false) => {
    setInviteModalUser(user);
    setIsNewMemberInvite(isNew);
  };

  return (
    <div className="min-h-screen bg-[#061914] text-slate-100 flex flex-col font-sans antialiased">
      {/* Top Header */}
      <AppHeader 
        onOpenPwaGuide={() => setShowPwaModal(true)} 
        onOpenNotifications={() => setShowNotificationModal(true)}
        onOpenKnowledgeHub={() => setShowKnowledgeHubModal(true)}
        unreadNotifCount={unreadNotifCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-4 py-2 overflow-x-hidden">
        {activeTab === 'home' && (
          <HomeView 
            onNavigateTab={setActiveTab}
            onOpenAttendance={(eventId) => setAttendanceEventId(eventId)}
            onOpenNotifications={() => setShowNotificationModal(true)}
            onOpenKnowledgeHub={() => setShowKnowledgeHubModal(true)}
            unreadNotifCount={unreadNotifCount}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleView 
            onOpenAttendance={(eventId) => setAttendanceEventId(eventId)}
            onOpenCreateEvent={handleOpenEditEvent}
          />
        )}

        {activeTab === 'roster' && (
          <RosterView 
            onSelectAthlete={(user) => setSelectedAthlete(user)}
            onOpenAddAthlete={handleOpenAddAthlete}
          />
        )}

        {activeTab === 'chat' && (
          <ChatView 
            onOpenCreateChannel={() => setShowCreateChannelModal(true)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView 
            onOpenPwaModal={() => setShowPwaModal(true)}
            onEditProfile={handleOpenEditAthlete}
            onOpenKnowledgeHub={() => setShowKnowledgeHubModal(true)}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        onChangeTab={setActiveTab} 
      />

      {/* Modals & Dialogs */}
      <KnowledgeHubModal 
        isOpen={showKnowledgeHubModal}
        onClose={() => setShowKnowledgeHubModal(false)}
      />

      <NotificationCenterModal 
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onSelectNotification={handleSelectNotification}
      />

      <PwaModal 
        isOpen={showPwaModal} 
        onClose={() => setShowPwaModal(false)} 
      />

      {attendanceEvent && (
        <EventAttendanceModal 
          event={attendanceEvent}
          isOpen={Boolean(attendanceEventId)}
          onClose={() => setAttendanceEventId(null)}
        />
      )}

      {showCreateEvent && (
        <CreateEventModal 
          isOpen={showCreateEvent}
          onClose={() => {
            setShowCreateEvent(false);
            setEditingEvent(undefined);
          }}
          initialEvent={editingEvent}
        />
      )}

      {selectedAthlete && (
        <AthleteDetailModal 
          user={selectedAthlete}
          isOpen={Boolean(selectedAthlete)}
          onClose={() => setSelectedAthlete(null)}
          onEdit={(user) => {
            setSelectedAthlete(null);
            handleOpenEditAthlete(user);
          }}
          onSendInvite={(user) => {
            handleSendInvite(user, false);
          }}
        />
      )}

      {showEditAthleteModal && (
        <EditAthleteModal 
          isOpen={showEditAthleteModal}
          onClose={() => {
            setShowEditAthleteModal(false);
            setEditingUser(null);
          }}
          initialUser={editingUser}
          onSaved={(savedUser, isNew) => {
            if (isNew) {
              handleSendInvite(savedUser, true);
            }
          }}
        />
      )}

      {inviteModalUser && (
        <MemberInviteModal 
          user={inviteModalUser}
          isOpen={Boolean(inviteModalUser)}
          onClose={() => setInviteModalUser(null)}
          isNewMember={isNewMemberInvite}
        />
      )}

      {showCreateChannelModal && (
        <CreateChannelModal 
          isOpen={showCreateChannelModal}
          onClose={() => setShowCreateChannelModal(false)}
        />
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
