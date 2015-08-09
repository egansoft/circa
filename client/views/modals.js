var that = this

Template.category.helpers({
    categories: function() {
        return that.categories
    }
})

Template.filterChecks.helpers({
    categories: function() {
        return that.categories
    },
    getChecked: function(params) {
        return that.filters[params.hash.category] ? 'checked' : ''
    }
})

Template.filterChecks.events({
    'click .filterCheck': function(e) {
        that.filters[e.target.value] = e.target.checked
    }
})
$(function() {
    $("form input").keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            $('button[type=submit] .default').click();
            return false;
        } else {
            return true;
        }
    });
});
