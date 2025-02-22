// service-worker.js
const FIREBASE_URL = "https://vm-map-runner-default-rtdb.asia-southeast1.firebasedatabase.app/users";

// Lắng nghe sự kiện periodic sync
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'update-location') {
        event.waitUntil(updateLocationInBackground());
    }
});

// Lắng nghe khi Service Worker được cài đặt
self.addEventListener('install', (event) => {
    console.log("✅ Service Worker installed.");
    self.skipWaiting(); // Kích hoạt Service Worker ngay lập tức
});

// Lắng nghe khi Service Worker được kích hoạt
self.addEventListener('activate', (event) => {
    console.log("✅ Service Worker activated.");
    self.clients.claim(); // Kiểm soát tất cả client ngay lập tức
});

// Hàm cập nhật vị trí trong nền
async function updateLocationInBackground() {
    try {
        // Lấy userId từ client (truyền qua postMessage nếu cần)
        const userId = await getUserIdFromClient();
        if (!userId) {
            console.log("⚠ No userId found for background location update.");
            return;
        }

        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            });
        });

        const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        await fetch(`${FIREBASE_URL}/${userId}.json`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location, isOnline: true })
        });

        console.log("📍 Background location updated:", location);
    } catch (error) {
        console.error("⚠ Error updating location in background:", error);
    }
}

// Lấy userId từ client (truyền từ main.js)
async function getUserIdFromClient() {
    const clients = await self.clients.matchAll();
    if (clients.length === 0) return null;

    return new Promise((resolve) => {
        clients[0].postMessage({ type: "GET_USER_ID" });
        self.addEventListener('message', (event) => {
            if (event.data.type === "USER_ID_RESPONSE") {
                resolve(event.data.userId);
            }
        });
    });
}

// Nhận message từ main.js
self.addEventListener('message', (event) => {
    if (event.data.type === "GET_USER_ID") {
        event.source.postMessage({
            type: "USER_ID_RESPONSE",
            userId: localStorage.getItem("userId") // Giả sử userId được lưu trong localStorage
        });
    }
});