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

/**
 * Displays an on-device browser notification for an app event. This is kept
 * deliberately separate from remote Web Push: it never creates a subscription
 * and cannot claim to deliver notifications while the browser is closed.
 */
export async function showBrowserNotification(title: string, options: NotificationOptions = {}): Promise<boolean> {
  if (getBrowserNotificationStatus() !== 'granted') return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, {
      ...options,
      tag: options.tag || 'ayzek-update',
      data: { url: '/', ...(options.data as Record<string, unknown> | undefined) },
    });
    return true;
  } catch {
    return false;
  }
}
