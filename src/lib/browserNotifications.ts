export type BrowserNotificationStatus = 'unsupported' | 'insecure' | NotificationPermission;

export function getBrowserNotificationStatus(): BrowserNotificationStatus {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return 'unsupported';
  if (!window.isSecureContext) return 'insecure';
  return Notification.permission;
}

export async function requestBrowserNotificationPermission(): Promise<BrowserNotificationStatus> {
  const current = getBrowserNotificationStatus();
  if (current === 'unsupported' || current === 'insecure') return current;
  if (current === 'granted') return current;
  return Notification.requestPermission();
}

export async function registerBrowserNotificationWorker(): Promise<void> {
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
  await navigator.serviceWorker.register('/notification-worker.js', { scope: '/' });
}
