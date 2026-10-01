/* ============================================================
   Meu CCEM 2026 — Service Worker
   ------------------------------------------------------------
   O congresso acontece no Expoville com centenas de pessoas na
   mesma rede. O app precisa abrir mesmo sem conexão utilizável.

   Estratégia: cada publicação é uma versão fechada.
   - Instalação: os arquivos essenciais entram todos ou nenhum
     (cache.addAll). Se faltar um, a versão nova é descartada e a
     anterior continua valendo — nunca fica um app pela metade.
   - A versão nova espera. O app mostra "Nova versão disponível ·
     Atualizar" e só troca quando o congressista toca (ou quando
     o app é fechado e aberto de novo). Nada muda no meio do uso.
   - Uso: tudo sai do cache da versão em vigor, sem misturar
     arquivos de versões diferentes; o que não está no cache vem
     da rede e é guardado.
   - /api/ (Assistente) nunca passa pelo cache.

   Ao publicar uma atualização, incrementar CACHE_VERSION.
   ============================================================ */

const CACHE_VERSION = 'ccem-v12';
const CACHE_NAME    = CACHE_VERSION;

// Sem estes, o app não funciona: entram juntos ou a versão não instala.
const ESSENCIAL = [
  './',
  './index.html',
  './manifest.json',
  './vendor/react.production.min.js',
  './vendor/react-dom.production.min.js',
  './v4/ccem-data.js',
  './v4/ccem-lib.js',
  './v4/ccem-screens.js',
  './v4/ccem-home.js',
  './v4/ccem-caderno.js',
  './v4/ccem-assistente.js',
  './v4/ccem-app.js',
];

// Desejáveis: se falharem, o app funciona assim mesmo.
const OPCIONAL = [
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './logo-ccem.png',
  './logo-sbem.png',
  './v4/logo-ccem.png',
  './v4/logo-sbem.png',
  './v4/avatar-assistente.png',
  './vendor/fonts/fonts.css',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(ESSENCIAL).then(() =>
        Promise.all(OPCIONAL.map(url => cache.add(url).catch(() => null)))))
      // Faltou algo: descarta a versão nova inteira; a anterior segue valendo.
      .catch(erro => caches.delete(CACHE_NAME).then(() => { throw erro; }))
  );
});

// O app manda 'aplicar' quando o congressista toca em "Atualizar".
self.addEventListener('message', event => {
  if (event.data === 'aplicar') self.skipWaiting();
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
  if (url.pathname.startsWith('/api/')) return;   // assistente: sempre na rede, nunca em cache

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      // Navegação (inclusive ?agora=… e #/rotas): sempre o index.html desta versão.
      const chave = req.mode === 'navigate' ? './index.html' : req;
      return cache.match(chave).then(cached => {
        if (cached) return cached;
        return fetch(req).then(res => {
          if (res && res.ok && req.mode !== 'navigate') cache.put(req, res.clone());
          return res;
        });
      });
    })
  );
});
