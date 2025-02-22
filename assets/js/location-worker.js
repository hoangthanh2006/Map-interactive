let watchId = null;

self.onmessage = (event) => {
    if (event.data.command === "start") {
        const { userId, interval } = event.data;
        if (!navigator.geolocation) {
            self.postMessage({ type: "error", message: "Geolocation not supported in worker" });
            return;
        }

        const updateLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = { lat: position.coords.latitude, lng: position.coords.longitude };
                    self.postMessage({ type: "locationUpdate", location });
                },
                (error) => {
                    console.error("[Worker] Location error:", error);
                },
                { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
            );
        };

        // Gọi lần đầu tiên ngay lập tức
        updateLocation();
        // Lặp lại mỗi 300ms
        watchId = setInterval(updateLocation, interval);
        console.log("[Worker] Started tracking location every 300ms for user:", userId);
    } else if (event.data.command === "stop") {
        if (watchId !== null) {
            clearInterval(watchId);
            watchId = null;
            console.log("[Worker] Stopped tracking location.");
        }
    }
};