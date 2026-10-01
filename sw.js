/* ============================================================
   Meu CCEM 2026 — Service Worker
   ------------------------------------------------------------
   O congresso acontece no Expoville com centenas de pessoas na
   mesma rede. O app precisa abrir mesmo sem conexão utilizável.

   Estratégia:
   - vendor/ e ícones  → cache-first (imutáveis, versionados por deploy)
   - resto do shell    → stale-while-revalidate (abre instantâneo,
                         atualiza em segundo plano para o próximo load)
   - navegação         → cache-first com rede de fallback, e o shell
                         em cache como resposta offline

   Ao publicar uma atualização, incrementar CACHE_VERSION.
   ============================================================ */

const CACHE_VERSION = 'ccem-v8';
const CACHE_NAME    = CACHE_VERSION;

const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './logo-ccem.png',
  './logo-sbem.png',
  './vendor/react.production.min.js',
  './vendor/react-dom.production.min.js',
  './vendor/fonts/fonts.css',
  './v4/ccem-data.js',
  './v4/ccem-lib.js',
  './v4/ccem-screens.js',
  './v4/ccem-home.js',
  './v4/ccem-app.js',
];

// Imutáveis: uma vez em cache, servir do cache sem consultar a rede.
const IMUTAVEL = /\/vendor\/|\/icon-\d+\.png$|\.woff2$/;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      // addAll falha inteiro se um recurso falhar; aqui cada um é
      // independente para que uma fonte ausente não derrube o install.
      .then(cache => Promise.all(
        SHELL.map(url => cache.add(url).catch(() => null))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(nomes => Promise.all(
        nomes.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navegação: servir o shell em cache, atualizando em segundo plano.
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then(cached => {
        const rede = fetch(req)
          .then(res => {
            if (res && res.ok) {
              const copia = res.clone();
              caches.open(CACHE_NAME).then(c => c.put('./index.html', copia));
            }
            return res;
          })
          .catch(() => cached);
        return cached || rede;
      })
    );
    return;
  }

  if (IMUTAVEL.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        if (res && res.ok) {
          const copia = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copia));
        }
        return res;
      }))
    );
    return;
  }

  // Demais recursos: stale-while-revalidate.
  event.respondWith(
    caches.match(req).then(cached => {
      const rede = fetch(req)
        .then(res => {
          if (res && res.ok) {
            const copia = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, copia));
          }
          return res;
        })
        .catch(() => cached);
      return cached || rede;
    })
  );
});
