const CACHE_NAME = 'share-target-cache';
const ALL_CACHES = [CACHE_NAME];

self.addEventListener('install', (installEvent) => {
    installEvent.waitUntil(
        (async () => {
            await caches.open(CACHE_NAME);
            self.skipWaiting();
        })()
    );
});

self.addEventListener('activate', (activateEvent) => {
    activateEvent.waitUntil(
        (async () => {
            const cacheKeys = await caches.keys();
            await Promise.all(
                cacheKeys.map(async (cacheKey) => {
                    if (!ALL_CACHES.includes(cacheKey)) {
                        await caches.delete(cacheKey);
                    }
                })
            );
            self.clients.claim();
        })()
    );
});

self.addEventListener('fetch', (fetchEvent) => {
    const url = new URL(fetchEvent.request.url);
    if (
        url.pathname === '/' &&
        url.searchParams.has('share-target') &&
        fetchEvent.request.method === 'POST'
    ) {
        return fetchEvent.respondWith(
            (async () => {
                const formData = await fetchEvent.request.formData();
                const file = formData.get('file');
                const title = formData.get('title') || '';
                const text = formData.get('text') || '';
                const url = formData.get('url') || '';

                const keys = await caches.keys();
                const sharedCache = await caches.open(
                    keys.filter((key) => key.startsWith('share-target'))[0]
                );

                if (file) {
                    await sharedCache.put('shared-file', new Response(file));
                }
                await sharedCache.put('shared-title', new Response(title));
                await sharedCache.put('shared-text', new Response(text));
                await sharedCache.put('shared-url', new Response(url));

                return Response.redirect('./?share-target', 303);
            })()
        );
    }
});
