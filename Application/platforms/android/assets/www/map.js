console.log("map.js");
var callback = function(response, status) {
    console.log("Entered callback");
    if (status == 'OK') {
        console.log("Entered callback, status OK");
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;

        for (var i = 0; i < origins.length; i++) {
            var results = response.rows[i].elements;
            for (var j = 0; j < results.length; j++) {
                var element = results[j];
                var distance = element.distance.text;
                var distance_in_km = element.distance.value / 1000;
                var duration = element.duration.text;
                var from = origins[i];
                var to = destinations[j];
                alert(distance + "" + to);
                if (location_names.indexOf(to) < 0) {
                  location_names.push(to);
                  location_dists.push(distance_in_km);
                }
            }
        }
        min = 9999999999999999;
        for (var k = 0; k < location_names.length; k++) {
          if (location_dists[k] < min) {
            closest = location_names[k];
            min = location_dists[k];
          }
        }
        alert(closest + "" + min);
    }
    console.log("Exited callback");
}

// Current Location, in LatLng object form
var latLng;

// Array to store nearby location names and their distances
var location_names = [];
var location_dists = [];

// Closest location
var closest;

// if (localStorage.getItem("Location") == null) {
//  localStorage.setItem("Location", JSON.stringify([]));
// }

// Local storage of locations
// var storage = JSON.parse(localStorage.getItem("Location"));

// function resetStorage() {
//     localStorage.removeItem("Location");
//     storage = [];
// }
// function showStorage() {
//  alert("localStorage" + " " + localStorage.getItem("Location"));
//   alert("storage" + " " + storage);
//   for (var i in storage) {alert("i " + i + " " + i.constructor.name);}
// }

function distance(origin, destination) {
    console.log("Entered distance");
    service.getDistanceMatrix({
        origins: origin,
        destinations: destination,
        travelMode: 'DRIVING',
        avoidHighways: false,
        avoidTolls: false,
    }, callback);
    console.log("Exited distance");
}
var onSuccessful_LocationAcquiring_ExternalPlugin = function(position) {
    var msg = ["Current your location:\n",
        "latitude:" + position.coords.latitude,
        "longitude:" + position.coords.longitude,
        "speed:" + position.coords.speed,
        "time:" + position.timestamp
    ].join("\n");

    latLng = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    map.addMarker({
        'position': latLng,
        'title': msg
    }, function(marker) {
        marker.showInfoWindow();
    });

};

var onError_LocationAcquiring_ExternalPlugin = function(msg) {
    alert("error: " + msg);
};

var onSuccessful_LocationAcquiring_Inbuilt = function(location) {
    var msg = ["Current your location:\n",
        "latitude:" + location.latLng.lat,
        "longitude:" + location.latLng.lng,
        "speed:" + location.speed,
        "time:" + location.time,
        "bearing:" + location.bearing
    ].join("\n");

    map.addMarker({
        'position': location.latLng,
        'title': msg
    }, function(marker) {
        marker.setDraggable(true);
        marker.showInfoWindow();
    });
};

function showOnlineLocs() {
  alert(online_locations);
}

var onError_LocationAcquiring_Inbuilt = function(msg) {
    alert("error: " + msg);
};
var map;
document.addEventListener("deviceready", function() {
    var div = document.getElementById("map_canvas");

    // Initialize the map view
    map = plugin.google.maps.Map.getMap(div);

    // Enable My Location button
    // map.setMyLocationEnabled(true);

    // Enable background mode
    // cordova.plugins.backgroundMode.enable();

    // Check if background mode activated
    cordova.plugins.backgroundMode.onactivate = function() {
        alert("background mode on");
    };

    // Check if background mode deactivated
    cordova.plugins.backgroundMode.ondeactivate = function() {
        alert("background mode off");
    };

    // Error in activating background mode
    cordova.plugins.backgroundMode.onfailure = function(errorCode) {
        alert(errorCode);
    };

    // Hide the parent input form
    // document.getElementById("Parents_Form").style.display="none";

    // Wait until the map is ready status.
    map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
}, false);


var setLocClicked = false;
var service;


function onMapReady() {
    // smsReady();
    var button = document.getElementById("button");
    button.addEventListener("click", onBtnClicked, false);

    // Add a New Location
    document.getElementById("addloc").addEventListener("click", function() {
        addLocation(setLocClicked)
    }, false);

    // Find the closest location
    document.getElementById("closest").addEventListener("click", function() {
        findClosest()
    }, false);

    // Reset the localStorage
    // document.getElementById("reset").addEventListener("click", function() {
    //     resetStorage()
    // }, false);

    // Show the localStorage
    // document.getElementById("show").addEventListener("click", function() {
    //     showStorage()
    // }, false);

    // Show the online_locations data
    // document.getElementById("show_online").addEventListener("click", function() {
    //     showOnlineLocs()
    // }, false);

    // Update the online_locations data
    document.getElementById("update_online_locs").addEventListener("click", function() {
        retrieveLocations(false)
    }, false);

    // Display the online_locations locations
    document.getElementById("display_online").addEventListener("click", function() {
        displayLocation()
    }, false);

    // Hide the online_locations locations
    document.getElementById("hide_online").addEventListener("click", function() {
        hideDisplayedLocations()
    }, false);


    // Hide the Parent Info Block
    document.getElementById("Parents_Form").style.display="none";

    // Initialise Google Maps Distance Finder
    service = new google.maps.DistanceMatrixService();

    navigator.geolocation.getCurrentPosition(onSuccessful_LocationAcquiring_ExternalPlugin, onError_LocationAcquiring_ExternalPlugin);
    // map.getMyLocation(onSuccessful_LocationAcquiring_Inbuilt, onError_LocationAcquiring_Inbuilt);
}

function onBtnClicked() {
    map.showDialog();
}

function findClosest() {
    console.log("findClosest");
    distance([latLng], online_locations);
}

// Current Position of marker when Adding Location
var currentPos;
// Marker while Adding Location
var current_marker;
// Array of Markers when Displaying Online Locations
var displayed_markers = [];

var setLoc = function(marker) {
    marker.getPosition(
        function(latLng) {
            currentPos = latLng;
            current_marker = marker;
            marker.setTitle(latLng.toUrlValue());
            marker.showInfoWindow();
        }
    );
}

function addLocation(clicked) {
    console.log("addLocation");
    if (!clicked) {
        console.log("Not Already Clicked");
        setLocClicked = true;
        document.getElementById("addloc").innerHTML = "Confirm";

        map.addMarker({
                'position': latLng,
                'draggable': true
            },

            function(marker) {
                marker.addEventListener(plugin.google.maps.event.MARKER_DRAG_END, setLoc);
            }
        );

    } else {
        console.log("Already Clicked");
        if ((currentPos != "") && (currentPos != null) && (typeof currentPos != "undefined")) {
            document.getElementById("addloc").innerHTML = "Add Location";
            current_marker.remove();
            setLocClicked = false;
            document.getElementById("Locations_Form").style.display="none";
            document.getElementById("Parents_Form").style.display="block";
            // addItemLocation(currentPos.lat, currentPos.lng, online_locations.length + 1);
        }
    }
}

function displayLocation() {
  retrieveLocations(true);
}

function displayLocations() {
    for (var i = 0; i < online_locations.length; i++) {
        var temp_loc = online_locations[i];
        var msg = "Info:\n" + "Parent: " + online_parents_names[i] + "\nNumber: " + online_parents_numbers[i]
        map.addMarker(
            {
            'position': temp_loc,
            'title': msg
            },
            function(marker) {displayed_markers.push(marker);}
        );
    }
}

function hideDisplayedLocations() {
  for (var i = 0; i < displayed_markers.length; i++) {
    displayed_markers[i].remove();
  }
  displayed_markers = [];
}

function addParent() {
    console.log("addParent");
    var name = document.getElementById("parent_name").value;
    var number = document.getElementById("parent_number").value;
    document.getElementById("Locations_Form").style.display="block";
    document.getElementById("Parents_Form").style.display="none";
    addItemLocation(currentPos.lat, currentPos.lng, online_locations.length + 1, name, number);
    // addItemParent(name, number, online_parents.length + 1);
}

// Geocoding

function geocode() {

    var location = document.getElementById("geocode_location").value;

    var request = {
      'address': location
    };
    plugin.google.maps.Geocoder.geocode(request,
        function(results) {
            if (results.length) {
                var result = results[0];
                var position = result.position; 

                map.addMarker({
                    'position': position,
                    'title': location
                }, function(marker) {
                    marker.showInfoWindow();
                });
            }

            else {
                alert("Not found");
            }
        }
    );
}

// Reverse Geocoding

function reverseGeocode(position) {
    var request = {
        'position': position
    };


    plugin.google.maps.Geocoder.geocode(request, function(results) {
        if (results.length) {
            var result = results[0];
            var position = result.position;
            var address = [
                result.subThoroughfare || "",
                result.thoroughfare || "",
                result.locality || "",
                result.adminArea || "",
                result.postalCode || "",
                result.country || ""
            ].join(", ");

            alert(address);
        } else {
            alert("Not found");
        }
    });
}