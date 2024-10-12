self.addEventListener('install', event => {
  console.log('combined-install', event);
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('fetch', fetchEvent => {
  const url = new URL(fetchEvent.request.url);

  console.log('fetch', url.pathname, url.searchParams, fetchEvent.request.method);

  if (url.searchParams.has('share-target') && fetchEvent.request.method === 'POST') {
    return fetchEvent.respondWith(async () => {
      const formData = await fetchEvent.request.formData();

      const keys = await caches.keys();
      const sharedCache = await caches.open(
          keys.filter((key) => key.startsWith('share-target'))[0]
      );

      await sharedCache.put('shared-data', new Response(formData));
      return new Response.redirect('./?share-target', 303);
    });
  }
});
