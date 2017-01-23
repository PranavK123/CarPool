var map;
document.addEventListener("deviceready", function() {
  var div = document.getElementById("map_canvas");

  // Initialize the map view
  map = plugin.google.maps.Map.getMap(div);

  // Wait until the map is ready status.
  map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
}, false);

function onMapReady() {
  var button = document.getElementById("button");
  button.addEventListener("click", onBtnClicked, false);
}

function onBtnClicked() {
  map.showDialog();
}

var onSuccessful_LocationAcquiring = function(location) {
  var msg = ["Current your location:\n",
    "latitude:" + location.latLng.lat,
    "longitude:" + location.latLng.lng,
    "speed:" + location.speed,
    "time:" + location.time,
    "bearing:" + location.bearing].join("\n");

  map.addMarker({
    'position': location.latLng,
    'title': msg
  }, function(marker) {
    marker.showInfoWindow();
  });
};

var onError_LocationAcquiring = function(msg) {
  alert("error: " + msg);
};
// map.getMyLocation(onSuccessful_LocationAcquiring, onError_LocationAcquiring);
navigator.geolocation.getCurrentPosition(onSuccessful_LocationAcquiring, onError_LocationAcquiring);