import { type AppNotification } from '../types';

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '🏊 Meet RSVP Required',
    body: 'Stillwater Ponies Meet is this Thursday at 16:30. Please confirm your attendance by Wednesday 8 PM.',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    type: 'meet',
    read: false
  },
  {
    id: 'notif-2',
    title: '📢 Coach Anderson: Practice Update',
    body: 'Swimmers & Divers warmup begins promptly at 15:45 in Green & Gold gear.',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    type: 'announcement',
    read: false
  },
  {
    id: 'notif-3',
    title: '🍝 Maya Chen planned Pasta Party',
    body: 'Pre-meet bonding dinner at the Peterson Family Home on Wednesday at 18:00!',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    type: 'social',
    read: true
  }
];

export const isPushSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = (): NotificationPermission => {
  if (!isPushSupported()) return 'denied';
  return Notification.permission;
};

export const isIosDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

export const isStandalonePwa = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || 
    (window.navigator as any).standalone === true;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isPushSupported()) {
    console.warn('Notifications not supported in this browser.');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return 'denied';
  }
};

export const triggerDeviceNotification = async (title: string, options?: NotificationOptions): Promise<boolean> => {
  if (!isPushSupported()) return false;

  if (Notification.permission !== 'granted') {
    const requested = await requestNotificationPermission();
    if (requested !== 'granted') return false;
  }

  try {
    // Try service worker notification first (better on mobile / PWA)
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.showNotification) {
        await reg.showNotification(title, {
          icon: '/pwa-192x192.svg',
          badge: '/favicon.svg',
          ...options
        });
        return true;
      }
    }

    // Fallback to standard web notification
    new Notification(title, {
      icon: '/pwa-192x192.svg',
      ...options
    });
    return true;
  } catch (err) {
    console.warn('Could not display device notification:', err);
    return false;
  }
};
