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
  center: { lat: 51.451224988053085, lng: 5.453770513494129 }, //TODO: make it use live location if time
  zoom: 17,
};

let map = new L.map('map', mapOptions);

let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(layer);

let customMarker = L.icon({
  iconUrl: "../images/marker.svg",
  shadowUrl: "../images/markerShadow.svg",
  iconSize: [40,40],
  iconAnchor: [20, 35],
  shadowSize:   [35, 35], 
  shadowAnchor: [9, 26]
});

let customLocation = L.icon({
  iconUrl: "../images/currentlocation.svg",
  shadowUrl: "../images/currentlocationShadow.svg",
  iconSize: [30,30],
  iconAnchor: [15, 15],
  shadowSize:   [34, 34], 
  shadowAnchor: [16, 18]
});

let IconOptions = {
  title: "Current location",
  icon: customLocation
}

let marker = new L.Marker([51.451224988053085,5.453770513494129],IconOptions);
marker.addTo(map);

let apiKey = "57859398499044f892a16c2163555c8d";

let searchLocationMarker = null;

const addressSearchControl = L.control.addressSearch(apiKey, {
  position: "topleft",
  placeholder: "Enter an address here",
  resultCallback : (address) => {
    if(!address){
      return;
    }
    if(searchLocationMarker !== null){
      map.removeLayer(searchLocationMarker);
    }
    searchLocationMarker = L.marker([address.lat, address.lon], {icon: customMarker}).addTo(map);
    map.setView([address.lat, address.lon], 18);
  }
});  

  map.addControl (addressSearchControl);
