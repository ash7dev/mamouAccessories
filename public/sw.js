// Service Worker pour Mamou's Accessories PWA
const CACHE_NAME = 'mamou-accessories-v1';
const OFFLINE_URL = '/';

// Ressources à mettre en cache immédiatement
const CACHE_URLS = [
  '/',
  '/boutique',
  '/panier',
  '/logo.jpg',
  '/placeholder-product.svg',
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell');
      return cache.addAll(CACHE_URLS);
    })
  );
  // Force le nouveau service worker à devenir actif immédiatement
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Prend le contrôle de toutes les pages immédiatement
  self.clients.claim();
});

// Stratégie de cache: Network First avec fallback vers cache
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return;

  // Ignorer les requêtes vers des domaines externes (sauf Cloudinary pour les images)
  const url = new URL(event.request.url);
  if (
    url.origin !== self.location.origin &&
    !url.hostname.includes('cloudinary.com')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la réponse est OK, la mettre en cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // En cas d'échec du réseau, chercher dans le cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // Si c'est une navigation et qu'il n'y a rien en cache,
          // rediriger vers la page d'accueil en cache
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }

          // Sinon retourner une réponse 404
          return new Response('Ressource non disponible hors ligne', {
            status: 404,
            statusText: 'Not Found',
          });
        });
      })
  );
});

// Gestion des notifications push (pour le futur)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Mamou's Accessories";
  const options = {
    body: data.body || 'Nouvelle notification',
    icon: '/logo.jpg',
    badge: '/logo.jpg',
    vibrate: [200, 100, 200],
    data: data.url || '/',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Gestion du clic sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});
