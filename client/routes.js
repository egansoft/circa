Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

//Main Page
Router.route('/', {name: 'home'});
//Login Page
Router.route('/login');

//Load GoogleMaps only on Main Page
Router.onBeforeAction(function() {
	if (!Session.get("user")) {
		window.location.replace("/login");
	} else {
		GoogleMaps.load();
  		this.next();
  	}
}, {only: ['/']});


// MainController = RouteController.extend({
//   action: function() {
//   	this.render('home', {
// 	    data: function () {
// 	      return { posts: ['post red', 'post blue'] }
// 	    }
//   	});
//   }
// });
