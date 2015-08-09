Session.setDefault("social-markers", []);
Session.setDefault("exchange-markers", []);
Session.setDefault("study-markers", []);
Session.setDefault("food-markers", []);
Session.setDefault("sports-markers", []);
var that = this

var eventLat;
var eventLng;

var shape = {
    coord: [-32,-32,100,100],
    type: 'rect'
}

var loc;

function filterQuery() {
	query = {
		'$and' : [
			{'time' : {'$gt' : Date.now() - (1000 * 60 * 20)}},
			{'category' : {'$nin' : Session.get("filter")}}
		]
	};
	console.log(query);
	return query;
}

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
  var feet = 3.28084 * d;
  if (feet < 528)
    return Math.round(feet) + ' feet'
  else
    return (feet/5280).toFixed(1) + ' miles'
};

Template.home.helpers({
  CampusMapOptions: function() {
    loc = Geolocation.latLng()
  	if (GoogleMaps.loaded() && loc) {
  		return {
  			center: new google.maps.LatLng(loc.lat, loc.lng),
  			zoom: 15
  		};
  	}
  }

});

Template.home.onCreated(function() {
    var template = this
	GoogleMaps.ready("CampusMap", function(map) {
		var marker = new google.maps.Marker({
	      position: map.options.center,
	      map: map.instance
	    });
		google.maps.event.addListener(map.instance, 'click',
			function(event) {
				console.log(event);
				eventLat = event.latLng.lat();
				eventLng = event.latLng.lng();
				Modal.show('CreateEventModal');
			}
		);

		var events = {};
		var infowindow;

        template.autorun(function() {
            _.each(events, function(value, key) {
                events[key].setMap(null);
                google.maps.event.clearInstanceListeners(events[key]);
                delete events[key];
            })


            Events.find({
                'time' : {'$gt' : Date.now() - (1000 * 60 * 60)},
                'category' : {'$in': that.shownCategories.get() }
            }).observe({
    		// Events.find({time: {$gt : Date.now() - (10)}}).observe({
    			added: function(document) {
    				if(!that.filters[document.category])
    					return

                    var icon = that.categories.icon(document.category)
    				var marker = new google.maps.Marker({
    					draggable: false,
    					animation: google.maps.Animation.DROP,
    					position: new google.maps.LatLng(document.lat, document.lng),
    					map: map.instance,
                        icon: icon,
                        shape: shape,
    					id: document._id
    				});
    				// google.maps.event.addListener(marker, 'dragend', function(event) {
    				// 	Events.update(marker.id, {$set : {lat: event.latLng.lat(), lng: event.latLng.lng()}});
    				// });

    				google.maps.event.addListener(marker, DeviceListeners['open'],
    					function(){
    						infowindow = new google.maps.InfoWindow({
    							content: '<div class="content">'+
    						      '<h1 class="eventHeading">' + document.name + ' &mdash; ' + that.categories.display(document.category) + '</h1>'+
    						      '<div id=' + marker.id + '>'+
    							      '<p class="event-time-info-window"><strong>' + moment(document.startTime).fromNow() + '</strong></p>' +
    							      '<p class="event-time-info-window">' + getDistance(loc.lat, loc.lng, document.lat, document.lng) +' meters away</p>' +
    							      '<p><span class="event-capacity-info-window">'  + document.attending.length + '</span> people attending</p>' +
    							      '<ul class="attending"></ul>' +
    							      '<p id="rsvp-notice"></p>'+
    							      '<button data=' + marker.id + ' type="button" class="btn btn-primary rsvp-button">Let\'s Go!</button>' +
    						      '</div>'+
    						      '</div>',
                                 disableAutoPan: true
    						});
    						google.maps.event.addListener(infowindow, 'domready', function() {
							    // document.id("map-form").addEvent("submit", function(e) {
							    //     e.stop();
							    //     console.log("hi!");
							    // });
							    $('.rsvp-button').click(function() {
									try {
										var event_id = $(this).attr('data');

										console.log(event_id);

										var ev = Events.findOne(event_id);
										console.log(ev);
										if (ev.host != Meteor.user()._id && $.inArray(event_id, Meteor.user().attending) == -1) {
											$('#rsvp-notice').text("You're going!");
											$(event.target).closest('ul').append("<li><img src=http://graph.facebook.com/" + Meteor.user().services.facebook.id + "/picture/?type=small></li>");
											Meteor.users.update(Meteor.user()._id, {$addToSet: {"profile.attending": event_id}});
											Events.update(ev._id, {$addToSet: {attending: [Meteor.user().services.facebook.id, Meteor.user().services.facebook.name]}});
											console.log(Meteor.user().profile);
										}
									} catch (err) {
										console.log("we have an error", err);
									}
								});
							});
    						infowindow.open(GoogleMaps.maps.CampusMap.instance, marker); //TODO images only load on 2nd click?
    						if ($('#' + marker.id + ' .attending li').length < 1) {
    							var event = Events.findOne(marker.id);
    							event.attending.forEach(function(entry) {
    								$('#' + marker.id + ' .attending').append("<li><div class=\"dankness\">" +
                                        "<img src=http://graph.facebook.com/" + entry[0] +
                                        "/picture/?type=small class=\"img-responsive\"></div></li>");
    							});
    						}
    					}
    				);

    				// if (!Meteor.isCordova) {
    				// 	google.maps.event.addListener(marker, 'mouseout',
    				// 		function(){
    				// 			$('#' + marker.id + ' .attending').empty();
    				// 			infowindow.close(GoogleMaps.maps.CampusMap.instance, marker);
    				// 		}
    				// 	);
    				// }

    				//TODO add attending field to user schema to prevent from joining same event twice
    				// google.maps.event.addListener(marker, 'click',
    				// 	function(event) {
    				// 		if (document.host != Meteor.user()._id) {
    				// 			$('#rsvp-notice').text("You're going!");
    				// 			$('#' + marker.id + ' .attending').append("<li><img src=http://graph.facebook.com/" + Meteor.user().services.facebook.id + "/picture/?type=small></li>");
    				// 			Events.update(marker.id, {$addToSet: {attending: [Meteor.user().services.facebook.id, Meteor.user().services.facebook.name]}});
    				// 		}
    				// 	}
    				// );

    				google.maps.event.addListener(marker, DeviceListeners['delete'],
    					function(event) {
    						if (document.host == Meteor.user()._id) {
    							Events.remove(marker.id);
    						}
    					}
    				);

    				events[document._id] = marker;
    				// TODO filter
    				// var temp = Session.get(document.category + '-markers');
    				// temp.push(marker);
    				// console.log(temp);
    				// Session.set(document.category + '-markers',temp);
    				// console.log(Session.get(document.category + '-markers'));
    			},
    			changed: function(newDocument, oldDocument) {
    				events[newDocument._id].setPosition({lat: newDocument.lat, lng: newDocument.lng});
    				var attendees = $('#' + newDocument._id +' .event-capacity-info-window').text();
    				attendees = parseInt(attendees, 10) + 1;
    				$('#' + newDocument._id +' .event-capacity-info-window').text(attendees.toString());
    				if (newDocument.host == Meteor.user()._id) {
    					var newMember = newDocument.attending[newDocument.attending.length-1]
                        var img = '<img src="http://graph.facebook.com/' + newMember[0] + '/picture/?type=small" /> '
    					Flash.info(img + newMember[1] + ' joined your event: ' + newDocument.name)
    				}
    			},
    			removed: function(oldDocument) {
    				events[oldDocument._id].setMap(null);

    				google.maps.event.clearInstanceListeners(events[oldDocument._id]);

    				delete events[oldDocument._id];
    			}
    		});
        })
	});
});

Template.home.events({

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
		var eventCategory = $('#event-category').val();
		//Insert dat yo
		var date = new Date();
		Events.insert({
			lat: eventLat,
			lng: eventLng,
			name: eventName,
			startTime: date,
			time: Date.now(),
			category: eventCategory,
			attending: [[Meteor.user().services.facebook.id, Meteor.user().services.facebook.name]],
			host: Meteor.user()._id
		});
		Modal.hide('CreateEventModal');
		$('#create-form').trigger('reset');
	},
	"submit #create-event": function(event){
		event.preventDefault();
		$("#create-event-button").click();
	}
});
