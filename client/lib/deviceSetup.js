if (Meteor.isCordova) {
	DeviceListeners = {
		'open' : 'click',
		'delete' : 'dblclick',

	}
} else {
	DeviceListeners = {
		'open' : 'click',
		'delete' : 'rightclick'
	}
}