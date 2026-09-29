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

function publicKeyToUint8Array(publicKey: string): Uint8Array {
  const padded = `${publicKey}${'='.repeat((4 - publicKey.length % 4) % 4)}`;
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  const bytes = atob(base64);
  return Uint8Array.from(bytes, (character) => character.charCodeAt(0));
}

/** Creates a real Push API subscription after an explicit user interaction. */
export async function createRemotePushSubscription(publicKey: string): Promise<PushSubscription> {
  if (!('PushManager' in window)) throw new Error('Bu tarayıcı uzaktan push bildirimini desteklemiyor.');
  const registration = await navigator.serviceWorker.ready;
  const existing = await registration.pushManager.getSubscription();
  if (existing) return existing;
  return registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: publicKeyToUint8Array(publicKey) as unknown as BufferSource });
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
