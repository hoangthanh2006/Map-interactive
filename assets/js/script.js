mapboxgl.accessToken = 'pk.eyJ1IjoiaG9hbmd0aGFuaDIwMDYiLCJhIjoiY2xmYzBqYTB3MDFuNjN3dGE1cm11MzE4MyJ9.IB-Z56PqrChaX87Z508FZA'; // Thay bằng API Key của bạn
const map = new mapboxgl.Map({
    container: 'map', // ID của thẻ div chứa bản đồ
    style: 'mapbox://styles/hoangthanh2006/cm68s7pmj000e01qu747e5kyd', // Kiểu bản đồ
    center: [106.702293, 10.782080], 
    zoom: 12 // Mức độ zoom
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
mapboxgl: mapboxgl
});


// var rotateButton = document.getElementById('rotate');
let rotating = false;
const rotateButton = document.getElementById('rotate');
rotateButton.addEventListener('click', () => {
if (!rotating) {
rotating = setInterval(() => {
    map.easeTo({ bearing: map.getBearing() + .2 });
}, 100);
} else {
clearInterval(rotating);
rotating = false;
}
});
// Rotate right to left
const rotateRightButton = document.getElementById('rotate-right');
rotateRightButton.addEventListener('click', () => {
    if (!rotating) {
        rotating = setInterval(() => {
            map.easeTo({ bearing: map.getBearing() - .2 });
        }, 100);
    } else {
        clearInterval(rotating);
        rotating = false;
    }
});

// Fly-in
const zoomInButton = document.getElementById('zoom-in');
let zoomInterval = null; // Biến để kiểm soát trạng thái interval

zoomInButton.addEventListener('click', () => {
    if (!zoomInterval) {
        zoomInterval = setInterval(() => {
            const currentZoom = map.getZoom();
            const currentPitch = map.getPitch();
            const currentBearing = map.getBearing();

            if (currentZoom >= 18) { // Dừng khi zoom đạt giới hạn mong muốn
                clearInterval(zoomInterval);
                zoomInterval = null;
                return;
            }

            map.easeTo({
                zoom: currentZoom + 0.01,   // Tăng zoom in
                pitch: Math.max(0, currentPitch - 0.01), // Giảm pitch để nhìn ngang dần
                bearing: currentBearing + 0.2, // Xoay nhẹ camera
                duration: 50  // Mượt hơn
            });
        }, 100);
    } else {
        clearInterval(zoomInterval);
        zoomInterval = null;
    }
});

// Fly-out
const zoomOutButton = document.getElementById('zoom-out');

let zoomOutInterval = null; // Biến để kiểm soát trạng thái interval

zoomOutButton.addEventListener('click', () => {
    if (!zoomOutInterval) {
        zoomOutInterval = setInterval(() => {
            const currentZoom = map.getZoom();
            const currentPitch = map.getPitch();
            const currentBearing = map.getBearing();

            if (currentZoom <= 1) { // Dừng khi zoom đạt giới hạn mong muốn
                clearInterval(zoomOutInterval);
                zoomOutInterval = null;
                return;
            }

            map.easeTo({
                zoom: currentZoom - 0.01,   // Giảm zoom out
                pitch: Math.min(60, currentPitch + 0.01), // Tăng pitch để nhìn dọc dần
                bearing: currentBearing - 0.2, // Xoay nhẹ camera
                duration: 50  // Mượt hơn
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

// Cập nhật vị trí user
map.on('load', () => {
    const userId = "device_" + Math.random().toString(36).substr(2, 9); // ID duy nhất cho mỗi user

    // Tạo marker tuỳ chỉnh
    const userLocationMarker = document.createElement('div');
    userLocationMarker.className = 'user-location-marker';

    // Kiểm tra nếu user đã có màu trong Firebase
    database.ref(`users/${userId}/color`).once("value", (snapshot) => {
        let userColor = snapshot.val();
        if (!userColor) {
            userColor = getRandomColor(); // Nếu chưa có, tạo màu ngẫu nhiên
            database.ref(`users/${userId}/color`).set(userColor); // Lưu vào Firebase
        }
        userLocationMarker.style.backgroundColor = userColor; // Gán màu cho marker
    });

    Object.assign(userLocationMarker.style, {
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        border: '3px solid white',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        transition: 'transform 0.3s ease-out'
    });

    const marker = new mapboxgl.Marker({ element: userLocationMarker })
        .setLngLat([0, 0])
        .addTo(map);

    let lastCoords = null;

    // Theo dõi vị trí liên tục
    navigator.geolocation.watchPosition(
        (position) => {
            const newCoords = [position.coords.longitude, position.coords.latitude];

            if (!lastCoords) {
                lastCoords = newCoords;
                marker.setLngLat(newCoords);
                map.setCenter(newCoords);
                return;
            }

            animateMarker(lastCoords, newCoords, marker);
            lastCoords = newCoords;

            // Cập nhật vị trí lên Firebase
            database.ref(`users/${userId}`).update({
                lat: newCoords[1],
                lng: newCoords[0]
            });

            map.easeTo({ center: newCoords, zoom: 15 });
        },
        (error) => console.error('Lỗi khi theo dõi vị trí:', error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    function animateMarker(startCoords, endCoords, marker) {
        const duration = 500;
        const startTime = performance.now();

        function frame(time) {
            const progress = Math.min((time - startTime) / duration, 1);
            const lng = startCoords[0] + (endCoords[0] - startCoords[0]) * progress;
            const lat = startCoords[1] + (endCoords[1] - startCoords[1]) * progress;

            marker.setLngLat([lng, lat]);

            if (progress < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
    }

    function getRandomColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }
});







// Khai báo drawing để vẽ đường
const drawing = new MapboxDraw({
    displayControlsDefault: false,
    controls: {
        polygon: true,
        line_string: true,
        point: true,
        trash: true
    },
    defaultMode: 'draw_polygon',
    styles: [
        {
            id: 'draw-polygon',
            type: 'fill',
            filter: ['all', ['==', '$type', 'Polygon']],
            paint: {
                'fill-color': '#000000',
                'fill-opacity': 0.5
            },
            layout: {
                visibility: 'visible'
            }
        },
        {
            id: 'draw-line',
            type: 'line',
            filter: ['all', ['==', '$type', 'LineString']],
            paint: {
                'line-color': '#EBAA3D',
                'line-width': 10,
                'fill-color': '#EBAA3D',
               
            },
            layout: {
                visibility: 'visible',
                'line-cap': 'round',
                'line-join': 'round',
                // 'line-dasharray': [1, 1],

      
            }
                
        },
        {
            id: 'draw-point',
            type: 'circle',
            filter: ['all', ['==', '$type', 'Point']],
            paint: {
                'circle-radius': 5,
                'circle-color': '#EB533D'
            },
            layout: {
                visibility: 'visible'
            }
        },
        {
            id: 'draw-trash',
            type: 'symbol',
            filter: ['all', ['==', '$type', 'Point']],
            paint: {
                'icon-color': '#000000',
                'icon-size': 1.5
            },
            layout: {
                visibility: 'visible'
            }
        },
        {
            id: 'draw-trash-hover',
            type: 'symbol',
            filter: ['all', ['==', '$type', 'Point']],
            paint: {
                'icon-color': '#000000',
                'icon-size': 2
            },
            layout: {
                visibility: 'visible'
            }
        },
        {
            id: 'draw-trash-active',
            type: 'symbol',
            filter: ['all', ['==', '$type', 'Point']],
            paint: {
                'icon-color': '#000000',
                'icon-size': 2.5
            },
            layout: {
                visibility: 'visible'
            },
            layout: {
                visibility: 'visible'
            }
        }
    ]
});

// Thêm drawing vào bản đồ
map.addControl(drawing, 'top-right');





// ----------------- Thêm điểm -----------------


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
  // Tạo ID duy nhất cho thiết bị
// Kiểm tra nếu userId chưa tồn tại, thì tạo mới
let userId = localStorage.getItem("userId");
if (!userId) {
    userId = "device_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("userId", userId);
}


// Chọn màu ngẫu nhiên
const colors = ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#ffa500", "#800080"];
const userColor = colors[Math.floor(Math.random() * colors.length)];


// Cập nhật vị trí của người dùng vào Firebase
function updateUserLocation(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    if (!lat || !lng) return; // Kiểm tra nếu lat/lng không hợp lệ

    const userCoords = {
        lat: lat,
        lng: lng,
        color: userColor, // Lưu màu vào Firebase
        timestamp: Date.now()
    };

    database.ref(`users/${userId}`).set(userCoords);
}

// Theo dõi vị trí liên tục
navigator.geolocation.watchPosition(updateUserLocation, (error) => {
    console.error("Lỗi lấy vị trí:", error);
}, {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 10000
});

const markers = {};

database.ref("users").on("value", (snapshot) => {
    const users = snapshot.val();
    
    for (const id in users) {
        const userData = users[id];

        // Kiểm tra nếu lat/lng hợp lệ
        if (!userData || !userData.lng || !userData.lat) continue;

        if (!markers[id]) {
            // Tạo marker mới nếu chưa có
            const el = document.createElement("div");
            el.className = "user-marker";
            el.style.backgroundColor = userData.color || "#007cbf"; // Màu mặc định nếu chưa có
            // Kiểm tra database nếu màu đã dùng rồi thì chuyển màu khác
            if (colors.includes(userData.color)) {
                colors.splice(colors.indexOf(userData.color), 1);
            }
            el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]; // Chọn màu ngẫu nhiên
          

            markers[id] = new mapboxgl.Marker(el)
                .setLngLat([userData.lng, userData.lat])
                .addTo(map);
        } else {
            // Cập nhật vị trí nếu user đã tồn tại
            markers[id].setLngLat([userData.lng, userData.lat]);
        }
    }
});
