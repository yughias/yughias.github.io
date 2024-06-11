const CACHE_NAME = 'emuboy';

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
        '/',

        '/img/cgb-cartridge.jpg',
        '/img/cgb-icon.png',
        '/img/cgb-overlay.png',
        '/img/dmg-cartridge.png',
        '/img/dmg-icon.png',
        '/img/dmg-overlay.png',
        '/img/icon.png',
        '/img/icon512_maskable.png',
        '/img/icon512_rounded.png',
        '/img/megaduck-cartridge.png',
        '/img/megaduck-overlay.png',
      
        '/style/dmg.css',
        '/style/cgb.css',
        '/style/megaduck.css',

        '/emulator.html',
        '/actions.js',
        '/emulator.js',
        '/emulator.wasm',
    ]);
  })());
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Get the resource from the cache.
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    } else {
        try {
          // If the resource was not in the cache, try the network.
          const fetchResponse = await fetch(event.request);

          // Save the resource in the cache and return it.
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        } catch (e) {
          // The network failed.
        }
    }
  })());
});