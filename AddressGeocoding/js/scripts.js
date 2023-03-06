if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(function (registering) {
      // Registration was successful
      console.log(
        "Browser: Service Worker registration is successful with the scope",
        registering.scope
      );
    })
    .catch(function (error) {
      //The registration of the service worker failed
      console.log(
        "Browser: Service Worker registration failed with the error",
        error
      );
    });
} else {
  //The registration of the service worker failed
  console.log("Browser: I don't support Service Workers :(");
}

let mapOptions = {
  zoom: 17,
};

function appendLocation(location) {
  let latlng = L.latLng(location.coords.latitude, location.coords.longitude);
  map.panTo(latlng);
  marker.setLatLng(latlng);
}

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function (location) {
    let latlng = L.latLng(location.coords.latitude, location.coords.longitude);
    mapOptions.center = latlng;
    map.setView(latlng, mapOptions.zoom);
    marker.setLatLng(latlng);
  }, function (error) {
    console.log(error);
  });
} else {
  target.innerText = "Geolocation API not supported.";
}

let map = new L.map("map", mapOptions);

let layer = new L.TileLayer(
  "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
);
map.addLayer(layer);

let customMarker = L.icon({
  iconUrl: "../images/marker.svg",
  shadowUrl: "../images/markerShadow.svg",
  iconSize: [40, 40],
  iconAnchor: [20, 35],
  shadowSize: [35, 35],
  shadowAnchor: [9, 26],
});

let customLocation = L.icon({
  iconUrl: "../images/currentlocation.svg",
  shadowUrl: "../images/currentlocationShadow.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  shadowSize: [34, 34],
  shadowAnchor: [16, 18],
});

let IconOptions = {
  title: "Current location",
  icon: customLocation,
};

let MarkerOptions = {
  title: null,
  icon: customMarker,
};

let marker = new L.Marker([0, 0], IconOptions);
marker.addTo(map);

let apiKey = "57859398499044f892a16c2163555c8d";

let searchLocationMarker = null;

const addressSearchControl = L.control.addressSearch(apiKey, {
  position: "topleft",
  placeholder: "Enter an address here",
  resultCallback: (address) => {
    if (!address) {
      return;
    }
    if (searchLocationMarker !== null) {
      map.removeLayer(searchLocationMarker);
      MarkerOptions.title = null;
    }
    MarkerOptions.title = address.formatted;
    searchLocationMarker = L.marker(
      [address.lat, address.lon],
      MarkerOptions
    ).addTo(map);
    map.setView([address.lat, address.lon], 18);
  },
});

map.addControl(addressSearchControl);