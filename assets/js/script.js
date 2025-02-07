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
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: true,
        placeholder: 'Nhập địa chỉ',
        language: 'vi',
        countries: 'vn',
        zoom: 12,
        flyTo: true,
        types: 'address,region,place,locality,neighborhood,poi',
        placeholder: 'Nhập địa chỉ',
        flyTo: {
            animate: true,
            speed: 1.5
        }
    }),
"top-left"
);

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
console.log(zoomOutButton)
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



// ✅ Thêm điều hướng
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
