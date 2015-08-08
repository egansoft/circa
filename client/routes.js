Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.map(function() {
	this.route('home', {path: '/'});
	this.route('login');
});

var mustBeSignedIn = function(pause) {
  if (!(Meteor.user())) {
    Router.go('login');
  }
  this.next();
};

var goToDashboard = function(pause) {
  if (Meteor.user()) {
    Router.go('home');
  }
  this.next();
};

Router.onBeforeAction(mustBeSignedIn, {only: ['home']});
Router.onBeforeAction(goToDashboard, {only: ['login']});

// MainController = RouteController.extend({
//   action: function() {
//   	this.render('home', {
// 	    data: function () {
// 	      return { posts: ['post red', 'post blue'] }
// 	    }
//   	});
//   }
// });
