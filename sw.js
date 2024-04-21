
let cacheData = "appV1";

this.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(cacheData).then((cache) => {
            cache.addAll([
                '/',
                '/static/js/bundle.js',
                '/index.html',
                '/about',
                '/user',
            ])
        })
    )
});

this.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then((result) => {
            if (result) {
                return result;
            }
            console.log(event.request)
            let requestUrl = event.request.clone();
            return fetch(requestUrl);
        })
    )
})