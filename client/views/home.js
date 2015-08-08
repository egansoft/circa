Template.home.helpers({
  CampusMapOptions: function() {
  	if (GoogleMaps.loaded()) {
  		return {
  			center: new google.maps.LatLng(-37.8136, 144.9631),
  			zoom: 8
  		};
  	}
  }
});

Template.home.onCreated(function() {
	GoogleMaps.ready("CampusMap", function(map) {
		var marker = new google.maps.Marker({
			position: map.options.center,
			map: map.instance
		});
	});
});

Template.home.events({
  
});