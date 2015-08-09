var that = this

var eventLat;
var eventLng;

var rad = function(x) {
  return x * Math.PI / 180;
};

var getDistance = function(lat1, lng1, lat2, lng2) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(lat2 - lat1);
  var dLong = rad(lng2 - lng1);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) * Math.cos(lat2) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};

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
		var marker = new google.maps.Marker({
	      position: map.options.center,
	      map: map.instance
	    });
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
				console.log(that.filters[document.category])
				if(!that.filters[document.category])
					return

                var icon = _.find(that.categories, function(category) {
                    return category.name == document.category
                }).icon
				var marker = new google.maps.Marker({
					draggable: true,
					animation: google.maps.Animation.DROP,
					position: new google.maps.LatLng(document.lat, document.lng),
					map: map.instance,
                    icon: icon,
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
							var event = Events.findOne(marker.id);
							event.attending.forEach(function(entry) {
								$('#' + marker.id + ' .attending').append("<li><img src=http://graph.facebook.com/" + entry[0] + "/picture/?type=small></li>");
							});
						}
					}
				);

				google.maps.event.addListener(marker, 'mouseout',
					function(){
						$('#' + marker.id + ' .attending').empty();
						infowindow.close(GoogleMaps.maps.CampusMap.instance, marker);
					}
				);

				google.maps.event.addListener(marker, 'click',
					function(event) {
						if (document.host != Meteor.user()._id) {
							$('#rsvp-notice').text("You're going!");
							$('#' + marker.id + ' .attending').append("<li><img src=http://graph.facebook.com/" + Meteor.user().services.facebook.id + "/picture/?type=small></li>");
							Events.update(marker.id, {$addToSet: {attending: [Meteor.user().services.facebook.id, Meteor.user().services.facebook.name]}});
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
				if (newDocument.host == Meteor.user()._id) {
					var newMember = newDocument.attending[newDocument.attending.length-1]
					Flash.info(newMember[1] + ' joined your event: ' + newDocument.name)
				}
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
			attending: [[Meteor.user().services.facebook.id, Meteor.user().services.facebook.name]],
			host: Meteor.user()._id
		});
		Modal.hide('CreateEventModal');
		$('#create-form').trigger('reset');
	}
});
