self.addEventListener("install", async (e) => {
  console.log("service worker installed");

  var cache = await caches.open("staticFlyX");
  cache.addAll([
    "./", 
    "./index.html", 
    "./pages/paises.html", 
    "./styles/index.css", 
    "./index.js",
    "./manifest.json",
    "./data/comentarios.json",
    "./images/atenas.jpg",
    "./images/atencion.png",
    "./images/facebook-icono.svg",
    "./images/fly-x-logo-144.png",
    "./images/fly-x-logo-144.svg",
    "./images/fly-x-logo-16.png",
    "./images/fly-x-logo-16.svg",
    "./images/fly-x-logo.ico",
    "./images/fly-x-logo.svg",
    "./images/instagram-icono.svg",
    "./images/lupa-icono.svg",
    "./images/madrid.jpg",
    "./images/mail-icono.svg",
    "./images/moscu.jpg",
    "./images/ofertas.png",
    "./images/playa-ilustracion.svg",
    "./images/rio-de-janeiro.jpg",
    "./images/seguridad.png",
    "./images/turista-ilustracion.svg",
    "./images/twitter-icono.svg",
    "./images/variedad.png",
    "./images/verificado.svg",
    "./images/viaje-header.svg",
    "./images/viaje-ilustracion.png"
  ]);
});

self.addEventListener("activate", () => {
  console.log("service worker activated");
});

self.addEventListener("fetch", function (event) {
  const req = event.request;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  return (await caches.match(req)) || fetch(req);
}

async function networkFirst(req) {
  const cache = await caches.open("staticFlyX");
  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (error) {
    const cachedResponse = await cache.match(req);
    return cachedResponse || (await caches.match("./manifest.json"));
  }
}
