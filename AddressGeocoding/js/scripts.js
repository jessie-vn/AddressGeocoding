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

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    mapId: "729d3d60d79d34c0",
    center: { lat: 51.451224988053085, lng: 5.453770513494129 },
    zoom: 16,
    disableDefaultUI: true
  });
  
new google.maps.Marker({
  position: {lat: 51.451224988053085, lng: 5.453770513494129 }, //TODO: make it use live location if time
  map,
  title: "Your location",
  icon:{
    url: "../images/marker.svg",
    scaledSize: new google.maps.Size(38,41)
  }
});
}


