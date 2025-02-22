self.addEventListener("install", (event) => {
    console.log("[Service Worker] Installed");
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("[Service Worker] Activated");
    self.clients.claim();
});

let trackingInterval = null;

self.addEventListener("message", (event) => {
    if (event.data.command === "startTracking") {
        const { userId, interval } = event.data;
        if (!trackingInterval) {
            trackingInterval = setInterval(() => {
                self.clients.matchAll({ includeUncontrolled: true }).then(clients => {
                    if (clients.length > 0) {
                        clients[0].postMessage({ command: "requestLocation", userId });
                    }
                });
            }, interval); // 1000ms = 1 giây
            console.log("[Service Worker] Started tracking every 1s for user:", userId);
        }
    } else if (event.data.command === "stopTracking") {
        if (trackingInterval) {
            clearInterval(trackingInterval);
            trackingInterval = null;
            console.log("[Service Worker] Stopped tracking.");
        }
    } else if (event.data.type === "locationUpdate") {
        const { location, userId } = event.data;
        updateLocationToFirebase(location, userId);
    }
});

// Gửi dữ liệu lên Firebase
async function updateLocationToFirebase(location, userId) {
    const firebaseUrl = "https://vm-map-runner-default-rtdb.asia-southeast1.firebasedatabase.app/users/";
    try {
        const response = await fetch(`${firebaseUrl}${userId}/location.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(location)
        });

        if (response.ok) {
            console.log("[Service Worker] Location updated to Firebase:", location);
        } else {
            console.error("[Service Worker] Failed to update location");
        }
    } catch (error) {
        console.error("[Service Worker] Fetch error:", error);
    }
}