var isLoading = new ReactiveVar(true);

Template.login.helpers({
  isLoading: function () {
    return isLoading.get();
  }
});

Template.login.onRendered(function() {
    if(!Meteor.user())
        isLoading.set(false)
})
