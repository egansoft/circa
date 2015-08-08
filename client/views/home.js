Template.home.helpers({
  CampusMapOptions: function() {
    var loc = Geolocation.latLng()
  	if (GoogleMaps.loaded() && loc) {
  		return {
  			center: new google.maps.LatLng(loc.lat, loc.lng),
  			zoom: 8
  		};
  	}
  }
});

Template.home.onCreated(function() {
	GoogleMaps.ready("CampusMap", function(map) {
		var marker = new google.maps.Marker({
			position: map.options.center,
			map: map.instance,
            label: 'M'
		});
	});
    Meteor.setTimeout(function() {
        console.log('location', Geolocation.latLng())
    }, 5000)
});

Template.home.events({

});
