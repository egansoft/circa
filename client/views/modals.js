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
        that.shownCategories.set(that.filters.get())
        console.log(that.shownCategories.get())
    }
})

Template.eventList.helpers({
    events: function() {
        var events = Events.find({}, {sort: {startTime:-1}}).fetch()
        return _.filter(events, function(event) {
            return _.find(event.attending, function(person) {
                return person[0] == Meteor.user().services.facebook.id
            })
        })
    },
    icon: function(param) {
        return that.categories.icon(param.hash.category)
    },
    time: function(param) {
        return moment(param.hash.time).fromNow()
    },
    img: function(param){
        return param.hash.thing[0]
    },
    emoji: function(){
        return _.map(that.emoji, function(val, key){
            return {name: key, icon: val.icon, feel: val.feel}
        })
    },
    getEvent: function(param) {
        return Template.parentData()._id
    },
    com: function(param) {
        var some = Events.findOne(param.hash.event)
        return some.emoji
    },
    comIcon: function(param) {
        return that.emoji[param.hash.name].icon
    }
})

Template.eventList.events({
    'click .dank': function(a) {
        Events.update($(a.target).attr('data-event'), {'$push': {emoji: $(a.target).attr('data-name')}})
    }
})

