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
