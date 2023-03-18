const cacheName = "Cache-geocoding";

const appFiles = ["./", "index.html", "./images/no-internet.svg"];

self.addEventListener("install", (installing) => {
  console.log("Service Worker: I am being installed, hello world!");

  installing.waitUntil(
    caches.open("Cache-geocoding").then((cache) => {
      console.log("Service Worker: Caching important offline files");
      return cache.addAll(appFiles);
    })
  );
});

self.addEventListener("activate", (activating) => {
  console.log("Service Worker: All systems online, ready to go!");
});

self.addEventListener("fetch", (fetching) => {
  fetching.respondWith(
    caches.match(fetching.request.url).then((response) => {
      return (
        response ||
        fetch(fetching.request)
          .then((response) => {
            return caches.open("Cache-geocoding").then((cache) => {
              if (
                !(
                  fetching.request.url.match(
                    ".*.tile.openstreetmap.org/.*.png"
                  ) || fetching.request.url.match(".*/service-worker.js")
                )
              ) {
                console.log(
                  "Service Worker: Caching (new) resource " +
                    fetching.request.url
                );
                cache.put(fetching.request, response.clone());
              }
              return response;
            });
          })
          .catch(function () {
            console.log("Service Worker: Fetching online failed, HAALLPPPP!!!");
            self.clients
            .matchAll({ type: "window" })
            .then((clients) => {
              clients.forEach((client) => {
                client.postMessage({
                  type: "offline",
                  data: {
                    mapHeight: "95vh",
                  },
                });
              });
            });
            return caches.match("./images/no-internet.svg");
          })
      );
    })
  );
});

self.addEventListener("push", (pushing) => {
  if (pushing.data) {
    pushdata = JSON.parse(pushing.data.text());
    console.log("Service Worker: I received this:", pushdata);
    if (pushdata["title"] != "" && pushdata["message"] != "") {
      const options = { body: pushdata["message"] };
      self.registration.showNotification(pushdata["title"], options);
      console.log("Service Worker: I made a notification for the user");
    } else {
      console.log(
        "Service Worker: I didn't make a notification for the user, not all the info was there :("
      );
    }
  }
});
