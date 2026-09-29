self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Server-originated push events are deliberately not handled until a VAPID
// subscription endpoint is configured. This worker only establishes the safe
// client-side foundation and must not fabricate remote notification delivery.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
    const existing = clients[0];
    return existing ? existing.focus() : self.clients.openWindow('/');
  }));
});
