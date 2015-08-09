//Marker images
Icons = {
	"Social" : "img/icons/drinks.png",
	"Study" : "img/icons/pencil.png",
	"Exchange" : "img/icons/heart.png", //TODO change
	"Food" : "img/icons/pizza.png",
	"Sports" : "img/icons/basketbal.png",
}
var eventLat;
var eventLng;



Template.home.helpers({
  CampusMapOptions: function() {
    var loc = Geolocation.latLng()
  	if (GoogleMaps.loaded() && loc) {
  		return {
  			center: new google.maps.LatLng(loc.lat, loc.lng),
  			zoom: 15
  		};
  	}
  }
});

Template.home.onCreated(function() {
	GoogleMaps.ready("CampusMap", function(map) {
		google.maps.event.addListener(map.instance, 'dblclick',
			function(event) {
				console.log(event);
				eventLat = event.latLng.lat();
				eventLng = event.latLng.lng();
				Modal.show('CreateEventModal');
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
					icon: Icons[document.category],
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
	// "click #modal-button": function() {
	// 	Modal.show('CreateEventModal');	
	// },
});

Template.CreateEventModal.helpers({
	getCoordinates: function() {
		return [eventLat, eventLng];
	}
});
Template.CreateEventModal.events({
	"click #create-event-button": function(event) {
		event.preventDefault();
		var eventName = $('#event-name').val();
		var eventDescription = $('#event-description').val();
		var eventStartTime = $('#event-time-start').val();
		var eventEndTime = $('#event-time-end').val();
		var eventCapacity = $('#event-capacity').val();
		var eventCategory = $('#event-category').val();
		//Insert dat yo
		Events.insert({
			lat: eventLat, 
			lng: eventLng,
			name: eventName,
			description: eventDescription,
			startTime: eventStartTime,
			endTime: eventEndTime,
			capacity: eventCapacity,
			category: eventCategory
		});
		Modal.hide('CreateEventModal');
		$('#create-form').trigger('reset');
	}
});

