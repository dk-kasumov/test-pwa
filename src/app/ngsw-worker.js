self.addEventListener('fetch', (fetchEvent) => {
  const url = new URL(fetchEvent.request.url);
  if (
      url.pathname === '/' && url.searchParams.has('share-target') && fetchEvent.request.method === 'POST'
  ) {
    return fetchEvent.respondWith(
        (async () => {
          const formData = await fetchEvent.request.formData();
          const image = formData.get('image');
          const keys = await caches.keys();
          const sharedCache = await caches.open(
              keys.filter((key) => key.startsWith('share-target'))[0]

          );
          await sharedCache.put('shared-image', new Response(image));
          return Response.redirect('./?share-target', 303);
        })()
    );
  }
});
