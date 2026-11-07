// Minimal service worker: lets the admin panel show system notifications on phones
// (mobile browsers only allow them through a service worker) and opens the booking when tapped.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim())
);

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url =
    (event.notification.data && event.notification.data.url) || "/admin";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windows) => {
        const open = windows.find((w) => w.url.includes("/admin"));
        if (open) return open.navigate(url).then((w) => (w || open).focus());
        return self.clients.openWindow(url);
      })
  );
});
