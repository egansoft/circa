Template.navbar.events({
    'click #showFilter': function() {
        Modal.show('filterModal')
    },
    'click #showMy': function() {
        Modal.show('eventsModal')
    }
})
