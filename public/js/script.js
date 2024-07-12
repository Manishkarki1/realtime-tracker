// Initialize socket connection
const socket = io();

// Initialize map
const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Initialize markers object and user's marker
const markers = {};
let userMarker;

// Get user's location
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
      updateUserLocation(latitude, longitude);
    },
    (error) => {
      console.error("Error getting location:", error);
      alert(
        "Unable to retrieve your location. Please check your settings and refresh the page."
      );
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );
} else {
  alert(
    "Geolocation is not supported by your browser. Please use a modern browser with location services enabled."
  );
}

// Update user's location on the map
function updateUserLocation(latitude, longitude) {
  if (!userMarker) {
    userMarker = L.marker([latitude, longitude], {
      icon: L.divIcon({
        className: "user-marker",
        html: '<div class="pulse"></div>',
        iconSize: [20, 20],
      }),
    }).addTo(map);
    map.setView([latitude, longitude]);
  } else {
    userMarker.setLatLng([latitude, longitude]);
  }
}

// Handle receiving location updates
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
  markers[id].bindPopup(`User ${id}`);
  // Update the marker's associated data
  markers[id].options.title = `User ${id}`;
  markers[id].feature = {
    type: "Feature",
    properties: {
      id: id,
      title: `User ${id}`,
    },
    geometry: {
      type: "Point",
      coordinates: [longitude, latitude],
    },
  };
});

// Handle user disconnection
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});

// Add custom controls
L.control
  .custom({
    position: "topright",
    content: '<button id="centerButton">Center Map</button>',
    classes: "btn-custom",
    style: {
      margin: "10px",
      padding: "0px 0 0 0",
      cursor: "pointer",
    },
    datas: {
      foo: "bar",
    },
    events: {
      click: function (data) {
        if (userMarker) {
          map.setView(userMarker.getLatLng(), 16);
        }
      },
    },
  })
  .addTo(map);

// Add Leaflet.draw controls
const drawControl = new L.Control.Draw({
  draw: {
    polyline: {
      metric: true,
    },
    polygon: {
      allowIntersection: false,
      drawError: {
        color: "#e1e100",
        message: "<strong>Oh snap!<strong> you can't draw that!",
      },
      shapeOptions: {
        color: "#97009c",
      },
    },
    circle: false,
    rectangle: false,
    marker: false,
  },
});
map.addControl(drawControl);

// Event listener for draw:created
map.on("draw:created", function (e) {
  const layer = e.layer;
  map.addLayer(layer);

  if (e.layerType === "polyline") {
    const latlngs = layer.getLatLngs();
    const distance = calculateDistance(latlngs);
    layer.bindPopup(`Distance: ${distance.toFixed(2)} meters`).openPopup();
  }
});

// Function to calculate distance of a polyline
function calculateDistance(latlngs) {
  let totalDistance = 0;
  for (let i = 1; i < latlngs.length; i++) {
    totalDistance += latlngs[i - 1].distanceTo(latlngs[i]);
  }
  return totalDistance;
}

// Add custom fullscreen control
L.Control.Fullscreen = L.Control.extend({
  onAdd: function (map) {
    const container = L.DomUtil.create(
      "div",
      "leaflet-control-fullscreen leaflet-bar leaflet-control"
    );
    const button = L.DomUtil.create(
      "a",
      "leaflet-control-fullscreen-button leaflet-bar-part",
      container
    );
    button.innerHTML = "🔎";
    button.href = "#";
    button.title = "Toggle Fullscreen";

    L.DomEvent.on(button, "click", function (e) {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      toggleFullScreen();
    });

    return container;
  },

  onRemove: function (map) {
    // Nothing to do here
  },
});

L.control.fullscreen = function (opts) {
  return new L.Control.Fullscreen(opts);
};

L.control.fullscreen({ position: "topleft" }).addTo(map);

function toggleFullScreen() {
  const doc = window.document;
  const docEl = doc.documentElement;

  const requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  const cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    requestFullScreen.call(docEl);
  } else {
    cancelFullScreen.call(doc);
  }
}

// Create a feature group for all markers
const featureGroup = L.featureGroup().addTo(map);

// Add search functionality
const searchControl = new L.Control.Search({
  layer: featureGroup,
  propertyName: "title",
  marker: false,
  moveToLocation: function (latlng, title, map) {
    map.setView(latlng, 16); // Zoom level 16
    const foundMarker = Object.values(markers).find(
      (marker) => marker.options.title === title
    );
    if (foundMarker) {
      foundMarker.openPopup();
    }
  },
});

searchControl.on("search:locationfound", function (e) {
  if (e.layer) {
    e.layer.openPopup();
  }
});

map.addControl(searchControl);

// Style for user marker pulse effect
const style = document.createElement("style");
style.textContent = `
  .user-marker {
    border-radius: 50%;
    background-color: #3388ff;
  }
  .pulse {
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(51, 136, 255, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(51, 136, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(51, 136, 255, 0);
    }
  }
`;
document.head.appendChild(style);

// Update feature group when markers change
function updateFeatureGroup() {
  featureGroup.clearLayers();
  Object.values(markers).forEach((marker) => {
    featureGroup.addLayer(marker);
  });
}

// Call updateFeatureGroup whenever markers are added or removed
socket.on("receive-location", updateFeatureGroup);
socket.on("user-disconnected", updateFeatureGroup);
