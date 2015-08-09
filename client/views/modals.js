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
        // var new_filter = Session.get('filter')
        // console.log(this.name);
        // if (!$.inArray(this.name, Session.get('filter'))) {
        //     console.log("in array");
        //     var index = new_filter.indexOf(this.name);
        //     new_filter.splice(index, 1);
        //     Session.set('filter', new_filter);
        //     console.log(Session.get('filter'));
        // } else {
        //     console.log("not in array");
        //     new_filter.push(this.name);
        //     console.log(new_filter);
        //     Session.set('filter', new_filter);
        //     console.log(Session.get('filter'));
        // }
        // console.log(that.filterQuery());
        that.filters[e.target.value] = e.target.checked
        that.shownCategories.set(that.filters.get())
        console.log(that.shownCategories.get())
    }
})
