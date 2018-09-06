document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);



function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('location')),
    { types: ['geocode'] });

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace().geometry.location;
  console.log(place.lat())

}



function initMap() {

  var address = "WeWork Atrium Tower, Eichhornstraße, Berlin"
  console.log(locationString)
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode(
    {
      address: locationString
    },
    function (results, status) {

      var resultLocations = [];

      if (status == google.maps.GeocoderStatus.OK) {
        if (results) {
          var numOfResults = results.length;
          for (var i = 0; i < numOfResults; i++) {
            var result = results[i];
            resultLocations.push(
              {
                text: result.formatted_address,
                addressStr: result.formatted_address,
                location: result.geometry.location
              }
            );
          };
        }
      } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
        // address not found
      }

      if (resultLocations.length > 0) {
        //alert("Locations found")
        var lat = resultLocations[0].location.lat()
        var lng = resultLocations[0].location.lng()


        var myLatLng = { lat, lng };
        console.log(myLatLng)

        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center: myLatLng
        });

        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: 'Hello World!'
        });








      } else {
        //callback(null);
      }
    }
  );


}


function addressToLocation(address, callback) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode(
    {
      address: address
    },
    function (results, status) {

      var resultLocations = [];

      if (status == google.maps.GeocoderStatus.OK) {
        if (results) {
          var numOfResults = results.length;
          for (var i = 0; i < numOfResults; i++) {
            var result = results[i];
            resultLocations.push(
              {
                text: result.formatted_address,
                addressStr: result.formatted_address,
                location: result.geometry.location
              }
            );
          };
        }
      } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
        // address not found
      }

      if (resultLocations.length > 0) {
        callback(resultLocations);
      } else {
        callback(null);
      }
    }
  );
}
