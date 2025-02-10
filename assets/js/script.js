mapboxgl.accessToken =
  "pk.eyJ1IjoiaG9hbmd0aGFuaDIwMDYiLCJhIjoiY2xmYzBqYTB3MDFuNjN3dGE1cm11MzE4MyJ9.IB-Z56PqrChaX87Z508FZA"; // Thay bằng API Key của bạn
const map = new mapboxgl.Map({
  container: "map", // ID của thẻ div chứa bản đồ
  style: "mapbox://styles/hoangthanh2006/cm68s7pmj000e01qu747e5kyd", // Kiểu bản đồ
  center: [106.702293, 10.78208],
  zoom: 12, // Mức độ zoom
});

// Thêm điều khiển zoom
map.addControl(new mapboxgl.NavigationControl());

// Thêm điều khiển chỉnh sửa địa điểm
// map.addControl(
//     new MapboxGeocoder({
//         accessToken: mapboxgl.accessToken,
//         mapboxgl: mapboxgl,
//         marker: true,
//         language: 'vi',
//         countries: 'vn',
//         zoom: 12,
//         flyTo: true,
//         types: 'address,region,place,locality,neighborhood,poi',
//         flyTo: {
//             animate: true,
//             speed: 1.5
//         },
//     }),
// "top-left", // Vị trí hiển thị

// );

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
});



// var rotateButton = document.getElementById('rotate');
let rotating = false;
const rotateButton = document.getElementById("rotate");
rotateButton.addEventListener("click", () => {
  if (!rotating) {
    rotating = setInterval(() => {
      map.easeTo({ bearing: map.getBearing() + 0.2 });
    }, 100);
  } else {
    clearInterval(rotating);
    rotating = false;
  }
});
// Rotate right to left
const rotateRightButton = document.getElementById("rotate-right");
rotateRightButton.addEventListener("click", () => {
  if (!rotating) {
    rotating = setInterval(() => {
      map.easeTo({ bearing: map.getBearing() - 0.2 });
    }, 100);
  } else {
    clearInterval(rotating);
    rotating = false;
  }
});

// Fly-in-left
const zoomInButton = document.getElementById("zoom-in-left");
let zoomInterval = null; // Biến để kiểm soát trạng thái interval

zoomInButton.addEventListener("click", () => {
  if (!zoomInterval) {
    zoomInterval = setInterval(() => {
      const currentZoom = map.getZoom();
      const currentPitch = map.getPitch();
      const currentBearing = map.getBearing();

      if (currentZoom >= 18) {
        // Dừng khi zoom đạt giới hạn mong muốn
        clearInterval(zoomInterval);
        zoomInterval = null;
        return;
      }

      map.easeTo({
        zoom: currentZoom + 0.005, // Tăng zoom in
        pitch: Math.max(0, currentPitch - 0.01), // Giảm pitch để nhìn ngang dần
        bearing: currentBearing + 0.1, // Xoay nhẹ camera
        duration: 50, // Mượt hơn
      });
    }, 100);
  } else {
    clearInterval(zoomInterval);
    zoomInterval = null;
  }
});

// Fly-in-right
const zoomInRightButton = document.getElementById("zoom-in-right");
let zoomInRightInterval = null; // Biến để kiểm soát trạng thái interval

zoomInRightButton.addEventListener
  ("click", () => {
    if (!zoomInRightInterval) {
      zoomInRightInterval = setInterval(() => {
        const currentZoom = map.getZoom();
        const currentPitch = map.getPitch();
        const currentBearing = map.getBearing();

        if (currentZoom >= 18) {
          // Dừng khi zoom đạt giới hạn mong muốn
          clearInterval(zoomInRightInterval);
          zoomInRightInterval = null;
          return;
        }

        map.easeTo({
          zoom: currentZoom + 0.005, // Tăng zoom in
          pitch: Math.max(0, currentPitch - 0.01), // Giảm pitch để nhìn ngang dần
          bearing: currentBearing - 0.2, // Xoay nhẹ camera
          duration: 50, // Mượt hơn
        });
      }, 100);
    } else {
      clearInterval(zoomInRightInterval);
      zoomInRightInterval = null;
    }
  });


// Fly-out
const zoomOutButton = document.getElementById("zoom-out");

let zoomOutInterval = null; // Biến để kiểm soát trạng thái interval

zoomOutButton.addEventListener("click", () => {
  if (!zoomOutInterval) {
    zoomOutInterval = setInterval(() => {
      const currentZoom = map.getZoom();
      const currentPitch = map.getPitch();
      const currentBearing = map.getBearing();

      if (currentZoom <= 1) {
        // Dừng khi zoom đạt giới hạn mong muốn
        clearInterval(zoomOutInterval);
        zoomOutInterval = null;
        return;
      }

      map.easeTo({
        zoom: currentZoom - 0.01, // Giảm zoom out
        pitch: Math.min(60, currentPitch + 0.01), // Tăng pitch để nhìn dọc dần
        bearing: currentBearing - 0.2, // Xoay nhẹ camera
        duration: 50, // Mượt hơn
      });
    }, 100);
  } else {
    clearInterval(zoomOutInterval);
    zoomOutInterval = null;
  }
});

// // ✅ Thêm điều hướng
// const directions = new MapboxDirections({
//     accessToken: mapboxgl.accessToken,
//     unit: 'metric',
//     profile: 'mapbox/walking',
//     controls: {
//         profileSwitcher: true
//     },
//     language: 'vi',
//     showAlternatives: true,
//     alternatives: true,
//     placeholderOrigin: 'Điểm xuất phát',
//     placeholderDestination: 'Điểm đến',
//     geocoder: {
//         language: 'vi',
//         countries: 'vn'
//     },
//     flyTo: {
//         animate: true,
//         speed: 1.5
//     },
//     showSteps: true,
//     interactive: true,
//     instructions: true,
//     instructionsContainer: '#instructions',
//     steps: true,
//     bannerInstructions: true,
//     routeSummary: true,
//     summary: true,
//     summaryContainer: '#summary',
//     summaryOptions: {
//         maxHeight: 100,
//         maxWidth: 300
//     },
//     controls: {
//         inputs: true,
//         instructions: true,
//         profileSwitcher: true
//     },

//   });

// map.addControl(directions, 'top-left');
// Lấy vị trí hiện tại và đặt làm điểm xuất phát
// navigator.geolocation.getCurrentPosition((position) => {
//     const userLocation = `${position.coords.longitude},${position.coords.latitude}`;
//     directions.setOrigin(userLocation);
// });

// // Khi người dùng click vào bản đồ, đặt điểm đến
// map.on('click', (e) => {
//     const destination = `${e.lngLat.lng},${e.lngLat.lat}`;
//     directions.setDestination(destination);
// });

// // Button "Start" để reset tuyến đường
// const startButton = document.getElementById('start');
// startButton.addEventListener('click', () => {
//     navigator.geolocation.getCurrentPosition((position) => {
//         const userLocation = `${position.coords.longitude},${position.coords.latitude}`;
//         directions.setOrigin(userLocation);
//         directions.removeRoutes(); // Xóa tuyến đường cũ
//     });
// });

// // Button "Stop" để xóa điểm xuất phát và điểm đến
// const stopButton = document.getElementById('stop');
// stopButton.addEventListener('click', () => {
//     directions.setOrigin(null);
//     directions.setDestination(null);
// });

// Khai báo drawing để vẽ đường
const drawing = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
    line_string: true,
    point: true,
    trash: true,
  },
  defaultMode: "draw_polygon",
  styles: [
    {
      id: "draw-polygon",
      type: "fill",
      filter: ["all", ["==", "$type", "Polygon"]],
      paint: {
        "fill-color": "#fff",
        "fill-opacity": 0.5,
      },
      layout: {
        visibility: "visible",
      },
    },
    {
      id: "draw-line",
      type: "line",
      filter: ["all", ["==", "$type", "LineString"]],
      paint: {
        "line-color": "#ff0000",
        "line-width": 20,
        "fill-color": "#EFF739 ",
        "fill-opacity": 1,
        "line-opacity": 1,
        "line-blur": 0,
      
     


      },
      layout: {
        visibility: "visible",
        "line-cap": "round",
        "line-join": "round",
        // 'line-dasharray': [1, 1],
      },
    },
    {
      id: "draw-point",
      type: "circle",
      filter: ["all", ["==", "$type", "Point"]],
      paint: {
        "circle-radius": 5,
        "circle-color": "#fff",
      },
      layout: {
        visibility: "visible",
      },
    },
    {
      id: "draw-trash",
      type: "symbol",
      filter: ["all", ["==", "$type", "Point"]],
      paint: {
        "icon-color": "#fff",
        "icon-size": 1.5,
      },
      layout: {
        visibility: "visible",
      },
    },
    {
      id: "draw-trash-hover",
      type: "symbol",
      filter: ["all", ["==", "$type", "Point"]],
      paint: {
        "icon-color": "#fff",
        "icon-size": 2,
      },
      layout: {
        visibility: "visible",
      },
    },
    {
      id: "draw-trash-active",
      type: "symbol",
      filter: ["all", ["==", "$type", "Point"]],
      paint: {
        "icon-color": "#fff",
        "icon-size": 2.5,
      },
      layout: {
        visibility: "visible",
      },
      
    },
  ],
});

// Thêm drawing vào bản đồ
map.addControl(drawing, "top-right");

// ----------------- Thêm điểm -----------------

const firebaseConfig = {
  apiKey: "AIzaSyCvZXkxayb40VJFy_9GyAYgZvtmX6ewtig",
  authDomain: "vm-map-runner.firebaseapp.com",
  databaseURL:
    "https://vm-map-runner-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "vm-map-runner",
  storageBucket: "vm-map-runner.firebasestorage.app",
  messagingSenderId: "665369729555",
  appId: "1:665369729555:web:92ee8e587b0dace2a33de6",
  measurementId: "G-16LE1RRKTX",
};

firebase.initializeApp(firebaseConfig);

// Kết nối Firebase
const database = firebase.database();



// 📌 Biến toàn cục
let userId = localStorage.getItem("userId");
let userColor = localStorage.getItem("userColor");
let userMarkers = {};
let isUserInteracting = false;

// 🟢 Hàm tạo/di chuyển marker + hiệu ứng nhấp nháy
function addUserMarker(location, color, userKey, userName) {
    if (!location) return;

    // Xóa marker cũ nếu tồn tại
    if (userMarkers[userKey]) {
        userMarkers[userKey].remove();
    }

    // Tạo phần tử HTML cho marker
    const markerElement = document.createElement("div");
    markerElement.className = "user-marker";
    markerElement.innerHTML = `<span class="marker-name">${userName}</span>`;

    // Thiết lập CSS
    Object.assign(markerElement.style, {
        position: "relative",
        backgroundColor: color,
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        border: "2px solid white",
        boxSizing: "border-box",
        animation: userKey === userId ? "blink-animation 1s infinite alternate" : "none"
    });

    const markerName = markerElement.querySelector(".marker-name");
    Object.assign(markerName.style, {
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

    // Tạo marker mới
    userMarkers[userKey] = new mapboxgl.Marker(markerElement)
        .setLngLat([location.lng, location.lat])
        .addTo(map);
}

// 🟢 Hàm xóa marker khi user rời khỏi
function removeUserMarker(userKey) {
    if (userMarkers[userKey]) {
        userMarkers[userKey].remove();
        delete userMarkers[userKey];
    }
}

// 🟢 Load danh sách online users
function loadOnlineUsers() {
    database.ref("users").on("value", (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            const userKey = childSnapshot.key;
            if (userData.location && userData.isOnline) {
                addUserMarker(userData.location, userData.color, userKey, userData.label);
            } else {
                removeUserMarker(userKey);
            }
        });
    });
}

// 🟢 Theo dõi vị trí user
function trackUserLocation() {
    if (!userId) return;

    navigator.geolocation.watchPosition(
        (position) => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            database.ref(`users/${userId}`).update({ location: userLocation });
            addUserMarker(userLocation, userColor, userId, userId);

            if (!isUserInteracting && userId !== "admin") {
                map.easeTo({
                    center: [userLocation.lng, userLocation.lat],
                    zoom: 15,
                    duration: 1000
                });
            }
            map.flyTo({
                center: [userLocation.lng, userLocation.lat],
                zoom: 15,
                speed: 0.5, // Điều chỉnh tốc độ di chuyển
            });
        },
        (error) => console.error("⚠ Lỗi lấy vị trí:", error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 300 }

        
    );
  

    
}

// 🎯 Xử lý tương tác bản đồ
map.on("movestart", () => isUserInteracting = true);
map.on("moveend", () => setTimeout(() => isUserInteracting = false, 1000));

// 🏁 Xử lý đăng nhập
document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.getElementById("login-container");
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const errorMessage = document.getElementById("error-message");

    if (userId) {
        database.ref(`users/${userId}/isOnline`).once("value", (snapshot) => {
            if (!snapshot.val()) {
                localStorage.clear();
                userId = null;
                return;
            }
            loadOnlineUsers();
            trackUserLocation();
        });

        database.ref(`users/${userId}`).update({ isOnline: true });
        database.ref(`users/${userId}/isOnline`).onDisconnect().set(false);
        loginContainer.style.display = "none";
    }

    // 🏁 Xử lý đăng nhập
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            errorMessage.innerText = "❌ Vui lòng nhập đầy đủ thông tin!";
            return;
        }

        loginUser(username, password);
    });

    // 🟢 Hàm đăng nhập
    function loginUser(username, password) {
        database.ref(`users/${username}`).once("value", (snapshot) => {
            const userData = snapshot.val();

            if (!userData || userData.password !== password) {
                errorMessage.innerText = "⚠ Tài khoản hoặc mật khẩu không đúng!";
                return;
            }

            console.log("✅ Đăng nhập thành công!");
            userId = username;
            userColor = userData.color;
            localStorage.setItem("userId", userId);
            localStorage.setItem("userColor", userColor);

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    database.ref(`users/${userId}`).update({
                        location: userLocation,
                        isOnline: true
                    });

                    addUserMarker(userLocation, userColor, userId, userId);
                    loginContainer.style.display = "none";

                    map.flyTo({
                        center: [userLocation.lng, userLocation.lat],
                        zoom: 15,
                        speed: 0.5
                    });

                    trackUserLocation();
                    loadOnlineUsers();
                },
                (error) => {
                    console.error("⚠ Lỗi lấy vị trí:", error);
                    alert("⚠ Không thể lấy vị trí của bạn!");
                }
            );
        });
    }

    // 🏁 Ngắt kết nối khi user tắt trình duyệt
    window.addEventListener("beforeunload", () => {
        if (userId) {
            database.ref(`users/${userId}`).update({ isOnline: false });
        }
    });

    // 🔥 CSS hiệu ứng nhấp nháy
    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes blink-animation {
            0% { opacity: 1; width: 30px; height: 30px; }
            50% { opacity: 0.2; width: 35px; height: 35px; }
            100% { opacity: 1; width: 30px; height: 30px; }
        }
    `;
    document.head.appendChild(style);
});