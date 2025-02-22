self.addEventListener("install", (event) => {
    console.log("[Service Worker] Installed");
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("[Service Worker] Activated");
    self.clients.claim();
});

self.addEventListener("periodicsync", (event) => {
    if (event.tag === "update-location") {
        event.waitUntil(updateLocationInBackground());
    }
});

// Cập nhật vị trí trong background
async function updateLocationInBackground() {
    try {
        const clients = await self.clients.matchAll({ includeUncontrolled: true });
        if (clients.length > 0) {
            clients[0].postMessage({ command: "getLocation" });
        }
    } catch (error) {
        console.error("[Service Worker] Error updating location:", error);
    }
}

// Nhận dữ liệu từ client và gửi lên Firebase
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "locationUpdate") {
        const { location, userId } = event.data;
        if (userId && location) {
            updateLocationToFirebase(location, userId);
        }
    } else if (event.data && event.data.type === "userId") {
        console.log("[Service Worker] Received userId:", event.data.userId);
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