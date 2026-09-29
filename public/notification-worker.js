const APP_SHELL_CACHE = 'ayzek-app-shell-v1';
const APP_SHELL_FILES = ['/', '/manifest.json', '/icon-192.svg', '/icon-512.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys
      .filter((key) => key.startsWith('ayzek-app-shell-') && key !== APP_SHELL_CACHE)
      .map((key) => caches.delete(key)))),
    self.clients.claim(),
  ]));
});

// Keep only the app shell and static same-origin assets available offline.
// Authenticated API calls are intentionally never cached because they may
// contain private or stale user data.
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(APP_SHELL_CACHE).then((cache) => cache.put('/', copy));
        }
        return response;
      })
      .catch(() => caches.match('/')));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached || fetch(request)
    .then((response) => {
      if (!response.ok) return response;
      const copy = response.clone();
      caches.open(APP_SHELL_CACHE).then((cache) => cache.put(request, copy));
      return response;
    })));
});

self.addEventListener('push', (event) => {
  let payload = { title: 'AYZEK', body: 'Yeni bir güncellemeniz var.', url: '/' };
  try {
    payload = { ...payload, ...(event.data ? event.data.json() : {}) };
  } catch {
    // A malformed provider payload must not break the worker or navigation.
  }
  event.waitUntil(self.registration.showNotification(payload.title, {
    body: payload.body,
    icon: '/icon-192.svg',
    badge: '/icon-192.svg',
    tag: payload.tag || 'ayzek-remote-push',
    data: { url: payload.url || '/' },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
    const existing = clients.find((client) => new URL(client.url).origin === self.location.origin);
    return existing ? existing.focus() : self.clients.openWindow(targetUrl);
  }));
});
