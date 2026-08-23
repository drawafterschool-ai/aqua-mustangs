import React, { useState } from 'react';
import { type AppNotification } from '../../types';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Sparkles, 
  Smartphone, 
  Info,
  Calendar,
  MessageSquare,
  Utensils,
  Megaphone,
  CheckCircle2
} from 'lucide-react';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  triggerDeviceNotification, 
  isIosDevice, 
  isStandalonePwa 
} from '../../services/notificationService';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onSelectNotification?: (notif: AppNotification) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification
}) => {
  const [permission, setPermission] = useState<NotificationPermission>(getNotificationPermission());
  const [testSent, setTestSent] = useState(false);

  if (!isOpen) return null;

  const isIos = isIosDevice();
  const isInstalled = isStandalonePwa();

  const handleEnableNotifications = async () => {
    const perm = await requestNotificationPermission();
    setPermission(perm);
    if (perm === 'granted') {
      await triggerDeviceNotification('🔔 Aqua Mustangs Alerts Activated!', {
        body: 'You will now receive instant meet reminders, schedule changes, and RSVP alerts on your phone!'
      });
    }
  };

  const handleSendTestNotification = async () => {
    setTestSent(true);
    await triggerDeviceNotification('🏊 Aqua Mustangs: Meet Alert', {
      body: 'Stillwater Ponies Meet warmup begins at 15:45 in Green & Gold gear!'
    });
    setTimeout(() => setTestSent(false), 3000);
  };

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'meet':
      case 'practice':
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case 'social':
        return <Utensils className="w-4 h-4 text-amber-400" />;
      default:
        return <Megaphone className="w-4 h-4 text-amber-300" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-emerald-700/60 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#06241b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-400 text-slate-950 rounded-full">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-300">
                Aqua Mustangs 2026-2027 Team Alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition px-2"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] hidden sm:inline">Mark read</span>
              </button>
            )}

            <button 
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* PUSH NOTIFICATION ACTIVATION CARD */}
          <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-600/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
                  Phone Push Notifications
                </h4>
              </div>

              {permission === 'granted' ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-300 border border-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Enabled
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                  Not Enabled
                </span>
              )}
            </div>

            {/* Platform specific guidance */}
            {isIos && !isInstalled && (
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-amber-500/40 text-xs text-amber-200/90 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>iPhone Requirement:</strong> To receive push alerts on iOS, first add this app to your Home Screen (Tap <strong>Share ➔ Add to Home Screen</strong>), then open it from your home screen to enable alerts.
                </span>
              </div>
            )}

            <p className="text-xs text-slate-300 leading-relaxed">
              Get instant alerts for meet RSVP deadlines, practice time adjustments from coaches, and pasta party get-togethers.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {permission !== 'granted' ? (
                <button
                  onClick={handleEnableNotifications}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white text-xs font-black rounded-xl shadow-lg border border-amber-400/40 transition flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-300" />
                  <span>Enable Push Notifications on this Device</span>
                </button>
              ) : (
                <button
                  onClick={handleSendTestNotification}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{testSent ? 'Notification Sent to Phone!' : 'Send Test Notification'}</span>
                </button>
              )}
            </div>
          </div>

          {/* NOTIFICATION FEED */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-1">
              Recent Team Activity ({notifications.length})
            </label>

            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/60 rounded-2xl border border-slate-800">
                You're all caught up! No notifications right now.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onSelectNotification?.(notif)}
                  className={`p-3.5 rounded-2xl border transition flex items-start gap-3 cursor-pointer ${
                    notif.read 
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-300 opacity-80' 
                      : 'bg-slate-900 border-emerald-600/50 shadow-md text-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getNotifIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="text-xs font-extrabold text-white truncate">{notif.title}</div>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">
                      {notif.body}
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Push alerts for iPhone (iOS 16.4+) &amp; Android
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
