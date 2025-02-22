// API Token
mapboxgl.accessToken = "pk.eyJ1IjoiaG9hbmd0aGFuaDIwMDYiLCJhIjoiY2xmYzBqYTB3MDFuNjN3dGE1cm11MzE4MyJ9.IB-Z56PqrChaX87Z508FZA";

// Khởi tạo bản đồ
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/hoangthanh2006/cm6z81qfi004p01qv46ec1fwp",
    center: [106.702293, 10.78208],
    zoom: 12
});

// Constants
const MAX_ZOOM = 18;
const MIN_ZOOM = 1;
const ANIMATION_SPEED = 0.005;
const ROTATION_SPEED = 0.2;
const ANIMATION_INTERVAL = 100;
const ANIMATION_DURATION = 50;

// Utility Functions
const easeToMap = (options) => map.easeTo({ duration: ANIMATION_DURATION, ...options });

const createAnimation = (condition, updateFn, interval = ANIMATION_INTERVAL) => {
    let intervalId = null;
    return {
        start: () => {
            if (!intervalId) {
                intervalId = setInterval(() => {
                    if (condition()) return this.stop();
                    updateFn();
                }, interval);
            }
        },
        stop: () => {
            clearInterval(intervalId);
            intervalId = null;
        },
        isRunning: () => !!intervalId
    };
};

// Map Controls
map.on("style.load", () => console.log("🔄 Style loaded successfully!"));
map.addControl(new mapboxgl.NavigationControl());

// Rotation Controls
const rotationControls = {
    "rotate": 1,
    "rotate-right": -1
};
Object.entries(rotationControls).forEach(([id, direction]) => {
    const control = createAnimation(
        () => false,
        () => easeToMap({ bearing: map.getBearing() + direction * ROTATION_SPEED })
    );
    document.getElementById(id).addEventListener("click", () =>
        control.isRunning() ? control.stop() : control.start()
    );
});

// Zoom Controls
const zoomControls = {
    "zoom-in-left": { speed: ANIMATION_SPEED, bearing: 0.1, pitch: -0.01, max: MAX_ZOOM },
    "zoom-in-right": { speed: ANIMATION_SPEED, bearing: -0.2, pitch: -0.01, max: MAX_ZOOM },
    "zoom-in-straight": { speed: ANIMATION_SPEED, bearing: 0, pitch: -0.5, max: MAX_ZOOM },
    "zoom-out": { speed: -0.01, bearing: -0.2, pitch: 0.01, max: MIN_ZOOM }
};
Object.entries(zoomControls).forEach(([id, { speed, bearing, pitch, max }]) => {
    const control = createAnimation(
        () => (speed > 0 ? map.getZoom() >= max : map.getZoom() <= max),
        () => {
            const currentZoom = map.getZoom();
            easeToMap({
                zoom: currentZoom + speed,
                pitch: Math.max(0, Math.min(60, map.getPitch() + pitch)),
                bearing: map.getBearing() + bearing
            });
        }
    );
    document.getElementById(id).addEventListener("click", () =>
        control.isRunning() ? control.stop() : control.start()
    );
});

// Drawing Control
const drawing = new MapboxDraw({
    displayControlsDefault: false,
    controls: { polygon: true, line_string: true, point: true, trash: true },
    defaultMode: "draw_polygon",
    styles: [
        { id: "draw-polygon", type: "fill", filter: ["all", ["==", "$type", "Polygon"]], paint: { "fill-color": "#fff" }, layout: { visibility: "visible" } },
        { id: "draw-line", type: "line", filter: ["all", ["==", "$type", "LineString"]], paint: { "line-color": "#9f214e", "line-width": 10, "line-opacity": 1 }, layout: { visibility: "visible", "line-cap": "round", "line-join": "round" } }
    ]
});
map.addControl(drawing, "top-right");

// Firebase Integration
const firebaseConfig = {
    apiKey: "AIzaSyCvZXkxayb40VJFy_9GyAYgZvtmX6ewtig",
    authDomain: "vm-map-runner.firebaseapp.com",
    databaseURL: "https://vm-map-runner-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "vm-map-runner",
    storageBucket: "vm-map-runner.firebasestorage.app",
    messagingSenderId: "665369729555",
    appId: "1:665369729555:web:92ee8e587b0dace2a33de6",
    measurementId: "G-16LE1RRKTX"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// User State
const userState = {
    id: localStorage.getItem("userId"),
    color: localStorage.getItem("userColor"),
    markers: {},
    customMarkers: {},
    isInteracting: false
};

// Marker Management
const createMarkerElement = (color, userKey, userName) => {
    const el = document.createElement("div");
    el.className = "user-marker";
    el.innerHTML = `
        <span class="marker-name">${userName}</span>
        <span class="img-runner">
            <div class="top3-runer">
                <div class="top1"><span>Top 1:</span><span class="name">Nguyễn Văn A</span></div>
                <div class="top2"><span>Top 2:</span><span class="name">Nguyễn Văn B</span></div>
                <div class="top3"><span>Top 3:</span><span class="name">Nguyễn Văn C</span></div>
            </div>
        </span>`;
    Object.assign(el.style, {
        backgroundColor: color,
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        border: "2px solid white",
        animation: "blink-animation 1s infinite"
    });
    const nameEl = el.querySelector(".marker-name");
    Object.assign(nameEl.style, {
        position: "absolute",
        top: "-40px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "3px 6px",
        borderRadius: "5px",
        fontSize: "12px",
        whiteSpace: "nowrap"
    });
    return el;
};

const addUserMarker = (location, color, userKey, userName) => {
    if (!location) return;
    if (userState.markers[userKey]) userState.markers[userKey].remove();
    userState.markers[userKey] = new mapboxgl.Marker(createMarkerElement(color, userKey, userName))
        .setLngLat([location.lng, location.lat])
        .addTo(map);
};

const removeUserMarker = (userKey) => {
    if (userState.markers[userKey]) {
        userState.markers[userKey].remove();
        delete userState.markers[userKey];
    }
};

const addUserCustomMarker = (location, color, key, label) => {
    const el = document.createElement("div");
    el.className = "user-custom-marker";
    Object.assign(el.style, { backgroundColor: color, width: "20px", height: "20px", borderRadius: "50%" });
    const popup = new mapboxgl.Popup().setHTML(`<b class="custom-label">${label}</b>`);
    userState.customMarkers[key] = new mapboxgl.Marker(el).setLngLat(location).setPopup(popup).addTo(map);
};

const smoothMoveMarker = (userKey, newLocation) => {
    const marker = userState.markers[userKey];
    if (!marker) return;
    const start = marker.getLngLat();
    let progress = 0;
    const animate = () => {
        if (progress < 1) {
            progress += 0.1;
            marker.setLngLat([
                start.lng + (newLocation.lng - start.lng) * progress,
                start.lat + (newLocation.lat - start.lat) * progress
            ]);
            requestAnimationFrame(animate);
        } else {
            marker.setLngLat([newLocation.lng, newLocation.lat]);
        }
    };
    requestAnimationFrame(animate);
};

// User Tracking with Service Worker Integration
const trackUserLocation = () => {
    if (!userState.id) return;
    if (!navigator.geolocation) {
        alert("⚠ Thiết bị không hỗ trợ định vị!");
        return;
    }

    const updateLocation = (position) => {
        const newLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        database.ref(`users/${userState.id}`).update({ location: newLocation })
            .then(() => console.log("📍 Updated location:", newLocation))
            .catch(error => console.error("⚠ Location update error:", error));
        smoothMoveMarker(userState.id, newLocation);
        if (!userState.isInteracting && userState.id !== "admin") {
            map.easeTo({ center: [newLocation.lng, newLocation.lat], zoom: 15, duration: 1000 });
        }
    };

    const watchId = navigator.geolocation.watchPosition(
        updateLocation,
        (error) => console.error("⚠ Location error:", error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    const cleanup = () => {
        navigator.geolocation.clearWatch(watchId);
        console.log("🛑 Stopped tracking location.");
    };

    window.addEventListener("beforeunload", cleanup);
    window.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "hidden") {
            console.log("📴 Page hidden, relying on Service Worker for location updates.");
        } else {
            console.log("📲 Page visible, resuming foreground tracking.");
        }
    });

    return cleanup;
};

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('assets/js/service-worker.js')
      .then(registration => {
          console.log("✅ Service Worker registered:", registration);

          // Đợi Service Worker sẵn sàng
          navigator.serviceWorker.ready.then((swRegistration) => {
              if ('periodicSync' in swRegistration) {
                  swRegistration.periodicSync.register('update-location', {
                      minInterval: 60 * 1000 // Cập nhật mỗi 1 phút
                  })
                  .then(() => console.log("✅ Periodic Sync registered"))
                  .catch(error => console.error("⚠ Periodic Sync registration failed:", error));
              } else {
                  console.log("ℹ Periodic Sync not supported in this browser.");
              }
          });
      })
      .catch(error => console.error("⚠ Service Worker registration failed:", error));
}
// Online Users
const loadOnlineUsers = () => {
    database.ref("users").on("value", (snapshot) => {
        snapshot.forEach(child => {
            const userData = child.val();
            const userKey = child.key;
            if (userData.location && userData.isOnline) {
                addUserMarker(userData.location, userData.color, userKey, userData.label || userKey);
            } else {
                removeUserMarker(userKey);
            }
        });
    });
};

// Authentication & Admin Features
document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        loginContainer: document.getElementById("login-container"),
        loginForm: document.getElementById("login-form"),
        username: document.getElementById("username"),
        password: document.getElementById("password"),
        error: document.getElementById("error-message"),
        logout: document.getElementById("logout"),
        hideAll: document.getElementById("hide-all"),
        showAll: document.getElementById("show-all"),
        toggleCustom: document.getElementById("toggle-markers-custom"),
        deleteCustom: document.getElementById("delete-markers-custom")
    };

    let cleanupTracking = null;

    const loginUser = (username, password) => {
        database.ref(`users/${username}`).once("value", (snapshot) => {
            const userData = snapshot.val();
            if (!userData || userData.password !== password) {
                elements.error.innerText = "⚠ Invalid credentials!";
                return;
            }

            userState.id = username;
            userState.color = userData.color;
            localStorage.setItem("userId", userState.id);
            localStorage.setItem("userColor", userState.color);
            database.ref(`users/${userState.id}`).update({ isOnline: true });
            database.ref(`users/${userState.id}/isOnline`).onDisconnect().set(false);
            elements.loginContainer.style.display = "none";

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = { lat: position.coords.latitude, lng: position.coords.longitude };
                    database.ref(`users/${userState.id}`).update({ location });
                    addUserMarker(location, userState.color, userState.id, userState.id);
                    map.flyTo({ center: [location.lng, location.lat], zoom: 15, speed: 0.5 });
                    cleanupTracking = trackUserLocation();
                    loadOnlineUsers();
                    checkAdmin(username);
                },
                (error) => alert("⚠ Unable to get your location!")
            );
        });
    };

    const checkAdmin = (username) => {
        if (username !== "admin") {
            document.querySelectorAll(".admin").forEach(tool => tool.style.display = "none");
            document.querySelector(".draw-line-tool").style.display = "none";
            return;
        }

        document.querySelectorAll(".admin").forEach(tool => tool.style.display = "block");
        const adminElements = {
            save: document.getElementById("save"),
            clear: document.getElementById("clear"),
            loadSelect: document.getElementById("load-draw"),
            load: document.getElementById("load"),
            deleteMap: document.getElementById("delete-map")
        };

        let drawHistory = [];
        const MAX_UNDO = 50;

        const saveState = () => {
            if (drawHistory.length >= MAX_UNDO) drawHistory.shift();
            drawHistory.push(drawing.getAll());
        };

        const undoLastDraw = () => {
            if (drawHistory.length > 1) {
                drawHistory.pop();
                drawing.deleteAll();
                drawing.set(drawHistory[drawHistory.length - 1]);
                console.log("↩ Undo successful!");
            }
        };

        adminElements.save.addEventListener("click", () => {
            const name = prompt("Enter drawing name:");
            if (!name) return;
            const data = drawing.getAll();
            data.features = data.features.map(f => ({ ...f, properties: f.properties || {} }));
            database.ref(`drawings/draw_${Date.now()}`).set({ name, data })
                .then(() => loadDrawingsList());
        });

        adminElements.clear.addEventListener("click", () => {
            drawing.deleteAll();
            database.ref("drawings").remove().then(() => loadDrawingsList());
        });

        adminElements.deleteMap.addEventListener("click", () => drawing.deleteAll());

        adminElements.load.addEventListener("click", () => {
            const drawId = adminElements.loadSelect.value;
            if (!drawId) return;
            database.ref(`drawings/${drawId}`).once("value", (snapshot) => {
                let data = snapshot.val()?.data;
                if (data) {
                    data.features = data.features.map(f => ({ ...f, properties: f.properties || {} }));
                    drawing.set(data);
                }
            });
        });

        const loadDrawingsList = () => {
            adminElements.loadSelect.innerHTML = `<option value="">Chọn bản vẽ...</option>`;
            database.ref("drawings").once("value", (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    Object.entries(data).forEach(([drawId, { name }]) => {
                        const option = document.createElement("option");
                        option.value = drawId;
                        option.textContent = name || `Bản vẽ ${drawId.split("_")[1]}`;
                        adminElements.loadSelect.appendChild(option);
                    });
                }
            });
        };
        loadDrawingsList();

        map.on("draw.create", saveState);
        map.on("draw.update", saveState);
        map.on("draw.delete", saveState);
        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.key === "z") {
                e.preventDefault();
                undoLastDraw();
            }
        });
    };

    if (userState.id) {
        database.ref(`users/${userState.id}/isOnline`).once("value", (snapshot) => {
            if (snapshot.val()) {
                database.ref(`users/${userState.id}`).update({ isOnline: true });
                elements.loginContainer.style.display = "none";
                cleanupTracking = trackUserLocation();
                loadOnlineUsers();
                checkAdmin(userState.id);
            } else {
                localStorage.clear();
                userState.id = null;
            }
        });
    }

    elements.loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = elements.username.value.trim();
        const password = elements.password.value.trim();
        if (!username || !password) {
            elements.error.innerText = "❌ Please fill in all fields!";
            return;
        }
        loginUser(username, password);
    });

    elements.logout.addEventListener("click", () => {
        database.ref(`users/${userState.id}`).update({ isOnline: false });
        if (cleanupTracking) cleanupTracking();
        localStorage.clear();
        window.location.reload();
    });

    elements.hideAll.addEventListener("click", () => {
        Object.keys(userState.markers).forEach(key => {
            database.ref(`users/${key}`).update({ isOnline: false });
            userState.markers[key].remove();
        });
    });

    elements.showAll.addEventListener("click", () => {
        database.ref(`users/${userState.id}`).update({ isOnline: true });
        Object.values(userState.markers).forEach(marker => marker.addTo(map));
    });

    elements.toggleCustom.addEventListener("click", () => {
        database.ref(`users/${userState.id}/markers`).once("value", (snapshot) => {
            const data = snapshot.val();
            if (data) Object.entries(data).forEach(([key, { location, color, label }]) => {
                addUserCustomMarker(location, color, key, label);
            });
        });
    });

    elements.deleteCustom.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete all your markers?")) {
            Object.values(userState.markers).forEach(marker => marker.remove());
            userState.markers = {};
            database.ref(`users/${userState.id}/markers`).remove();
            alert("🗑 All your markers deleted!");
        }
    });

    map.on("movestart", () => userState.isInteracting = true);
    map.on("moveend", () => setTimeout(() => userState.isInteracting = false, 3000));

    map.on("click", (e) => {
        if (["draw_line_string", "draw_polygon", "draw_point"].includes(drawing.getMode())) return;
        const location = e.lngLat;
        const markerName = prompt("Enter marker name:");
        if (!markerName) return;
        const color = prompt("Enter marker color (hex or name):") || "#ff0000";
        const key = `${userState.id}_${markerName.replace(/\s+/g, "_").toLowerCase()}`;
        addUserCustomMarker(location, color, key, markerName);
        database.ref(`users/${userState.id}/markers/${key}`).set({ location, color, label: markerName });
    });
});

// Styles
const style = document.createElement("style");
style.innerHTML = `
    @keyframes blink-animation {
        0% { opacity: 1; width: 30px; height: 30px; }
        50% { opacity: 1; width: 35px; height: 35px; }
        100% { opacity: 1; width: 30px; height: 30px; }
    }
`;
document.head.appendChild(style);