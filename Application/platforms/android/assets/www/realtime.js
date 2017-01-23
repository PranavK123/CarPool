var LocationStorageRef;
var LocationTableRef;

var ParentStorageRef;
var ParentTableRef;

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
        retrieveLocations();

        // console.log("Creating ParentInfo table Reference");
        // ParentStorageRef = ref;
        // ParentTableRef = ref.table("ParentInfo");   // Keep the Storage Reference for later usage
        // retrieveParents();  
    },
    function(error){
        alert("Error connecting to the Storage " + error);
    }
);

function retrieveLocations(disp) {
	online_locations = [];
	// online_locations_names = [];
	online_parents_names = [];
	online_parents_numbers = [];
	LocationTableRef.getItems(function(itemSnapshot) {
		if (itemSnapshot) {
			temp_Lat = itemSnapshot.val().Lat;
			temp_Long = itemSnapshot.val().Long;
			temp_Num = itemSnapshot.val().PhoneNumber;
			temp_Name = itemSnapshot.val().Name;
            temp_Perm = itemSnapshot.val().Permanent;
			online_parents_names.push(temp_Name);
			online_parents_numbers.push(temp_Num);
			online_locations.push(new plugin.google.maps.LatLng(temp_Lat, temp_Long));
            online_permanents.push(temp_Perm);
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

function addItemLocation(lat, long, id, name, number, permanent) {
    LocationTableRef.push({
        ID: id,
        Lat: lat,
        Long: long,
        PhoneNumber: number,
        Name: name,
        Permanent: permanent
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