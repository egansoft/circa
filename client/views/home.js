//Marker images
Icons = {
	"Social" : "img/icons/drinks.png",
	"Study" : "img/icons/pencil.png",
	"Exchange" : "img/icons/heart.png", //TODO change
	"Food" : "img/icons/pizza.png",
	"Sports" : "img/icons/basketball.png",
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
		var infowindow;

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
				// google.maps.event.addListener(marker, 'dragend', function(event) {
				// 	Events.update(marker.id, {$set : {lat: event.latLng.lat(), lng: event.latLng.lng()}});
				// });

				google.maps.event.addListener(marker, 'mouseover', 
					function(){
						infowindow = new google.maps.InfoWindow({
							content: '<div class="content">'+
						      '<h1 class="eventHeading">' + document.name + '--' + document.category + '</h1>'+
						      '<div id=' + marker.id + '>'+
						      '<p class="event-time-info-window"><strong>' + document.startTime + ' - ' + document.endTime + '</strong></p>' +
						      '<p><span class="event-capacity-info-window">'  + document.attending.length + '/' + document.capacity + '</span> people attending</p>' +
						      '<p>' + document.description + '</p>'+
						      '<ul class="attending"></ul>' +
						      '<p id="rsvp-notice"></p>'+
						      '</div>'+
						      '</div>'
						});
						infowindow.open(GoogleMaps.maps.CampusMap.instance, marker);
						if ($('#' + marker.id + ' .attending li').length < 1) {
							document.attending.forEach(function(entry) {
								$('#' + marker.id + ' .attending').append("<li><img src=http://graph.facebook.com/" + entry + "/picture/?type=small></li>");
							});
						}
					}
				);

				google.maps.event.addListener(marker, 'mouseout',
					function(){
						infowindow.close(GoogleMaps.maps.CampusMap.instance, marker);
					}
				);

				google.maps.event.addListener(marker, 'click',
					function(event) {
						if (document.host != Meteor.user()._id) {
							$('#rsvp-notice').text("You're going!");
							$('#' + marker.id + ' .attending').append("<li><img src=http://graph.facebook.com/" + Meteor.user().services.facebook.id + "/picture/?type=large></li>");
							Events.update(marker.id, {$addToSet: {attending: Meteor.user().services.facebook.id}});
						}
					}
				);

				events[document._id] = marker;
			},
			changed: function(newDocument, oldDocument) {
				events[newDocument._id].setPosition({lat: newDocument.lat, lng: newDocument.lng});
				var att = $('#' + newDocument._id +' .event-capacity-info-window').text();
				console.log("HELLO");
				console.log('the string is' + att);
				var capacity = att.substring(att.indexOf('/')); 
				console.log('cap is ' + capacity);
				att2 = parseInt(att.substring(0, att.indexOf('/')), 10) + 1;
				console.log('att2 is ' + att2);
				$('#' + newDocument._id +' .event-capacity-info-window').text(att2.toString() + capacity);
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
			category: eventCategory,
			attending: [Meteor.user().services.facebook.id],
			host: Meteor.user()._id
		});
		Modal.hide('CreateEventModal');
		$('#create-form').trigger('reset');
	}
});
