

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
		google.maps.event.addListener(map.instance, 'dblclick',
			function(event) {
				console.log(event);
				Events.insert({lat: event.latLng.lat(), lng: event.latLng.lng()});
			}
		);

		var events = {};

		Events.find().observe({
			added: function(document) {
				var marker = new google.maps.Marker({
					draggable: true,
					animation: google.maps.Animation.DROP,
					position: new google.maps.LatLng(document.lat, document.lng),
					map: map.instance,
					id: document._id
				});
				google.maps.event.addListener(marker, 'dragend', function(event) {
					Events.update(marker.id, {$set : {lat: event.latLng.lat(), lng: event.latLng.lng()}});
				});
				google.maps.event.addListener(marker, 'rightclick', 
					function(event) {
						Events.remove(marker.id);
					}
				);

				events[document._id] = marker;
			},
			changed: function(newDocument, oldDocument) {
				events[newDocument._id].setPosition({lat: newDocument.lat, lng: newDocument.lng});
			},
			removed: function(oldDocument) {
				events[oldDocument._id].setMap(null);

				google.maps.event.clearInstanceListeners(events[oldDocument._id]);

				delete events[oldDocument._id];
			}
		});
	});
});

Template.home.events({
  
});