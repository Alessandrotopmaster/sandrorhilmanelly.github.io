// Service Worker para PWA - Funcionamento Offline
const CACHE_NAME = 'sandro-rhilmanelly-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js',
  '/sandrorhilmanelly-amo-amigos/amigos-de-amor/',
  '/app-drimeam-absoluta/',
  '/Top--master--mestre-offline/'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker instalado');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Erro ao adicionar URLs ao cache:', error);
      })
  );
  self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker ativado');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deletando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estratégia de Fetch: Cache First, Fall back to Network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Estratégia Cache First para recursos estáticos
  if (request.method === 'GET' && 
      (url.pathname.endsWith('.js') || 
       url.pathname.endsWith('.css') || 
       url.pathname.endsWith('.png') || 
       url.pathname.endsWith('.jpg') || 
       url.pathname.endsWith('.jpeg') || 
       url.pathname.endsWith('.gif') || 
       url.pathname.endsWith('.svg') ||
       url.pathname.endsWith('.woff') ||
       url.pathname.endsWith('.woff2') ||
       url.pathname.endsWith('.ttf') ||
       url.pathname.endsWith('.json'))) {
    
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            console.log('Retornado do cache:', request.url);
            return response;
          }
          return fetch(request)
            .then(response => {
              // Não cachear respostas que não sejam 200
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseToCache);
                });
              
              return response;
            });
        })
        .catch(() => {
          console.log('Offline - Retornando página offline');
          return caches.match('/') || new Response('Offline - Por favor, conecte-se à internet');
        })
    );
  } else {
    // Estratégia Network First para HTML e requisições dinâmicas
    event.respondWith(
      fetch(request)
        .then(response => {
          if (!response || response.status !== 200) {
            return caches.match(request);
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(request, responseToCache);
            });

          return response;
        })
        .catch(() => {
          console.log('Tentando cache como fallback');
          return caches.match(request);
        })
    );
  }
});

// Background Sync (sincronização em background)
self.addEventListener('sync', event => {
  console.log('Background sync:', event.tag);
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  try {
    // Aqui você pode adicionar lógica de sincronização de dados
    console.log('Sincronizando dados...');
  } catch (error) {
    console.error('Erro na sincronização:', error);
  }
}

// Push Notifications
self.addEventListener('push', event => {
  console.log('Push notification recebida');
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Nova mensagem',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Sandro Rhilmanelly', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
