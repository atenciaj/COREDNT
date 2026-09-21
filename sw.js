const CACHE_NAME = 'soliwel-v1';
const ASSETS = [
  'index.html',
  'css/styles.css',
  'js/app.js',
  'js/db.js',
  'js/utils.js',
  'js/pdf.js',
  'js/pt_form.js',
  'js/mt_form.js',
  'js/ut_form.js',
  'js/vt_form.js',
  'js/herramientas.js',
  'js/backup.js',
  'js/jobs.js',
  'js/ai_generate.js',
  'js/core/entities/UTCalculations.js',
  'js/core/entities/MTCalculations.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
