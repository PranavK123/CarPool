var LocationStorageRef;
var LocationTableRef;

// Define your credentials and security mode
var credentials = {
  applicationKey: "mLDx7V",   // Your application key
  authenticationToken: "userToken",   // When auth is off it can be anything
  isSecure: true                                // Use SSL connection              
};

console.log("realtime.js");

Realtime.Storage.create( credentials,
    function(ref) {
        console.log("Creating LocationData table Reference");
        LocationStorageRef = ref;
        LocationTableRef = ref.table("LocationData");
        retrieveLocations(false);
    },
    function(error){
    }
);

function retrieveLocations(disp) {
    clearTemporaryData();
	online_locations = [];
	// online_locations_names = [];
	online_parents_names = [];
	online_parents_numbers = [];
    online_permanents = [];
    online_times = [];
	LocationTableRef.getItems(function(itemSnapshot) {
		if (itemSnapshot) {
			temp_Lat = itemSnapshot.val().Lat;
			temp_Long = itemSnapshot.val().Long;
			temp_Num = itemSnapshot.val().PhoneNumber;
			temp_Name = itemSnapshot.val().Name;
            temp_Perm = itemSnapshot.val().Permanent;
            temp_Time = itemSnapshot.val().Time;
			online_parents_names.push(temp_Name);
			online_parents_numbers.push(temp_Num);
			online_locations.push(new plugin.google.maps.LatLng(temp_Lat, temp_Long));
            online_permanents.push(temp_Perm);
            online_times.push(temp_Time);
			// online_locations_names.push( reverseGeocode(new plugin.google.maps.LatLng(temp_Lat, temp_Long)) );
		} else {
			if (disp) {displayLocations();}
		}
	},
	function(error) {
		alert("Oops, error retrieving items: " + error);
	});
}

// function retrieveParents() {
//     console.log("retrieveParents");
//     x = arguments.callee.caller ? arguments.callee.caller.name : "global";
//     console.log(x);
//     online_parents = [];
//     ParentTableRef.getItems(function(itemSnapshot) {
//       if (itemSnapshot) {
//         temp_Num = itemSnapshot.val().PhoneNumber;
//         temp_Name = itemSnapshot.val().Name;
//         online_parents.push(temp_Name);
//         online_parents.push(temp_Num);
//         console.log(temp_Num);
//         console.log(temp_Name);
//       } else {
//       }
//     },
//     function(error) {
//       alert("Oops, error retrieving items: " + error);
//     });
// }

function addItemLocation(lat, long, id, name, number, permanent, time) {
    LocationTableRef.push({
        ID: id,
        Lat: lat,
        Long: long,
        PhoneNumber: number,
        Name: name,
        Permanent: permanent,
        Time: time
    });
    retrieveLocations(false);
}

// function addItemParent(name, number, id) {
//     console.log("addItemParent");
//     ParentTableRef.push({
//         ID: id,
//         PhoneNumber: number,
//         Name: name
//     });
//     retrieveParents();
// }

function clearTemporaryData() {
    var d = new Date(),
    h = (d.getHours()<10?'0':'') + d.getHours(),
    m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    var nowTime = h + ':' + m;
    console.log(nowTime);
    LocationTableRef.getItems(function(itemSnapshot) {
        if (itemSnapshot) {
            var temp_Perm = itemSnapshot.val().Permanent;
            var temp_Time = itemSnapshot.val().Time;
            console.log(nowTime);
            d1 = Date.parse("01/01/2017 " + temp_Time);
            d2 = Date.parse("01/01/2017 " + nowTime);
            if (d2 > d1 && temp_Perm == "No") {
                itemSnapshot.ref().del(
                    function success(itemSnapshot) {
                        // Logs the value of the item
                        console.log(itemSnapshot.val());
                    }, 
                    function error(data) { 
                        console.error("Error:", data); 
                    }
                );
            }
        } else {
            console.log("Complete");
        }
    },
    function(error) {
        alert("Oops, error retrieving items: " + error);
    });
}