// HarvestShield AI — Service Worker v1.0
// Implements offline-first caching for critical farmer workflows

const CACHE_NAME = 'harvestshield-v1';
const API_CACHE_NAME = 'harvestshield-api-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/login',
  '/dashboard/farmer',
  '/dashboard/admin',
  '/manifest.json',
];

// API routes to cache (GET only)
const CACHEABLE_API_PATTERNS = [
  /\/api\/v1\/crops/,
  /\/api\/v1\/warehouses/,
  /\/api\/v1\/markets/,
  /\/api\/v1\/demo\/credentials/,
  /\/api\/v1\/demo\/stats/,
];

// Install: pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Some assets failed to pre-cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== API_CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin requests
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin && !url.hostname.includes('localhost')) return;

  // API caching: network-first with fallback
  const isApiCacheable = CACHEABLE_API_PATTERNS.some((p) => p.test(url.pathname));
  if (isApiCacheable) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(API_CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      });
    })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-harvest-data') {
    event.waitUntil(syncHarvestData());
  }
});

async function syncHarvestData() {
  console.log('[SW] Syncing offline harvest data...');
  // In production: read from IndexedDB and POST to API
}

// Push notifications (future: real-time alerts)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'HarvestShield Alert', {
      body: data.body || 'New alert from HarvestShield AI',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.tag || 'harvestshield-alert',
      data: data.url ? { url: data.url } : {},
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.notification.data?.url) {
    event.waitUntil(self.clients.openWindow(event.notification.data.url));
  }
});
