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



  // Kết nối Firebase
const database = firebase.database();
document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.getElementById("login-container");
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const errorMessage = document.getElementById("error-message");
    const togglePassword = document.querySelector(".toggle-password");

    // Kiểm tra localStorage để tự động đăng nhập
    const userId = localStorage.getItem("userId");
    const userColor = localStorage.getItem("userColor");
    const userLocation = localStorage.getItem("userLocation");

    if (userId && userColor) {
        console.log(`✅ Đã đăng nhập: ${userId}`);
        loginContainer.style.display = "none";

        // Nếu đã lưu vị trí, hiển thị lại marker
        if (userLocation) {
            const parsedLocation = JSON.parse(userLocation);
            addUserMarker(parsedLocation, userColor);
        }
    }

    // Xử lý ẩn/hiện mật khẩu
    togglePassword.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.innerText = "🙈";
        } else {
            passwordInput.type = "password";
            togglePassword.innerText = "👁️";
        }
    });

    // Xử lý đăng nhập
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            errorMessage.innerText = "❌ Vui lòng nhập đầy đủ thông tin!";
            return;
        }

        // Gọi hàm đăng nhập với Firebase
        loginUser(username, password);
    });
});

// Hàm đăng nhập với Firebase
function loginUser(username, password) {
    database.ref(`users/${username}`).once("value", (snapshot) => {
        const userData = snapshot.val();

        if (!userData || userData.password !== password) {
            console.log("❌ Sai tên đăng nhập hoặc mật khẩu!");
            document.getElementById("error-message").innerText = "⚠ Tài khoản hoặc mật khẩu không đúng!";
            return;
        }

        console.log("✅ Đăng nhập thành công!");
        document.getElementById("login-container").style.display = "none";

        // Lưu thông tin user vào localStorage
        localStorage.setItem("userId", username);
        localStorage.setItem("userColor", userData.color);
        localStorage.setItem("userLocation", JSON.stringify(userData.location));

        // Lấy vị trí user
        navigator.geolocation.getCurrentPosition((position) => {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            console.log("📍 Vị trí user:", userLocation);

            // Cập nhật vị trí user vào Firebase
            database.ref(`users/${username}`).update({ location: userLocation });

            // Lưu vị trí vào localStorage để dùng lại sau khi F5
            localStorage.setItem("userLocation", JSON.stringify(userLocation));

            // Hiển thị marker
            addUserMarker(userLocation, userData.color);

        }, (error) => {
            console.error("⚠ Lỗi lấy vị trí:", error);
            alert("⚠ Không thể lấy vị trí của bạn!");
        });
    });
}

// Hàm hiển thị marker trên bản đồ
function addUserMarker(location, color) {
    const markerElement = document.createElement("div");
    markerElement.className = "user-marker";
    markerElement.style.backgroundColor = color;
    markerElement.style.width = "20px";
    markerElement.style.height = "20px";
    markerElement.style.borderRadius = "50%";
    markerElement.style.border = "2px solid white";

    new mapboxgl.Marker(markerElement)
        .setLngLat([location.lng, location.lat])
        .addTo(map);
}
