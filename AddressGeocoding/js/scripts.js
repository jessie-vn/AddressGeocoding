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

//Asking for permission with the Notification API
if (typeof Notification !== typeof undefined) {
  //First check if the API is available in the browser
  Notification.requestPermission()
    .then(function (result) {
      //If accepted, then save subscriberinfo in database
      if (result === "granted") {
        console.log(
          "Browser: User accepted receiving notifications, save as subscriber data!"
        );
        navigator.serviceWorker.ready.then(function (serviceworker) {
          //When the Service Worker is ready, generate the subscription with our Serice Worker's pushManager and save it to our list
          const VAPIDPublicKey =
            "BO-PuUpctlaWL5PzSxzxf3FSpzfhIRYT1SU2OEg9PbzDKiOEZpoElPl_wRwJ7XAe5cOZgH8OckzAUdkYHfUj8OI"; // Fill in your VAPID publicKey here
          const options = {
            applicationServerKey: VAPIDPublicKey,
            userVisibleOnly: true,
          }; //Option userVisibleOnly is neccesary for Chrome
          serviceworker.pushManager.subscribe(options).then((subscription) => {
            //POST the generated subscription to our saving script (this needs to happen server-side, (client-side) JavaScript can't write files or databases)
            let subscriberFormData = new FormData();
            subscriberFormData.append("json", JSON.stringify(subscription));
            fetch("data/saveSubscription.php", {
              method: "POST",
              body: subscriberFormData,
            });
          });
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

let mapOptions = {
  zoom: 17,
};

let focused = true;

//TODO: set an option for when location is disabled/blocked

if ("geolocation" in navigator) {
  setInterval(() => {
    navigator.geolocation.getCurrentPosition(
    function (location) {
      let latlng = L.latLng(
        location.coords.latitude,
        location.coords.longitude
      );
      marker.setLatLng(latlng);
      console.log("Accuracy: " + location.coords.accuracy);
      if (focused) {
        map.panTo(latlng);
      }
    },
    function (error) {
      console.log(error);
    }
  ) }, 1000);
} else {
  target.innerText = "Geolocation API not supported.";
}

let map = new L.map("map", mapOptions);

let layer = new L.TileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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

const myLocationControl = L.Control.extend({
  options: {
    position: "topleft",
  },

  onAdd: function (map) {
    const container = L.DomUtil.create(
      "div",
      "leaflet-bar leaflet-control leaflet-button"
    );

    const button = L.DomUtil.create("button", "location-button", container);
    button.style.width = "30px";
    button.style.height = "30px";
    button.style.backgroundImage = 'url("../images/currentlocation.svg")';
    button.style.backgroundSize = "contain";
    button.title = "My location";

    L.DomEvent.on(button, "click", function () {
      focused = true;
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          function (location) {
            let latlng = L.latLng(
              location.coords.latitude,
              location.coords.longitude
            );
            marker.setLatLng(latlng);
            map.panTo(latlng);
          },
          function (error) {
            console.log(error);
          }
        );
      }
    });

    return container;
  },
});

let apiKey = "57859398499044f892a16c2163555c8d";

let searchLocationMarker = null;

const addressSearchControl = L.control.addressSearch(apiKey, {
  position: "topleft",
  placeholder: "Enter an address here",
  resultCallback: (address) => {
    if (!address) {
      if (searchLocationMarker !== null) {
        map.removeLayer(searchLocationMarker);
        MarkerOptions.title = null;
      }
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
    focused = false;
    map.setView([address.lat, address.lon], 18);
  },
});

map.addControl(addressSearchControl);

map.addControl(new myLocationControl());
