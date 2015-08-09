var that = this

this.categories = [
    {
        name: 'social',
        display: 'Social',
        icon: 'img/icons/drinks.png',
        show: true
    },
    {
        name: 'study',
        display: 'Study',
        icon: 'img/icons/pencil.png',
        show: true
    },
    {
        name: 'exchange',
        display: 'Exchange',
        icon: 'img/icons/heart.png',
        show: true
    },
    {
        name: 'food',
        display: 'Food',
        icon: 'img/icons/pizza.png',
        show: true
    },
    {
        name: 'sports',
        display: 'Sports',
        icon: 'img/icons/basketball.png',
        show: true
    }
]

this.filters = {}
for(var i=0;i<this.categories.length;i++) {
    this.filters[this.categories[i].name] = true
}

this.categories.display = function(name) {
    return _.find(that.categories, function(category) {
        return category.name == name
    }).display
}

this.categories.icon = function(name) {
    return _.find(that.categories, function(category) {
        return category.name == name
    }).icon
}

this.filters.get = function() {
    return _.filter(
        _.map(that.filters, function(enabled, key) {
            if(enabled)
                return key
        }),
        function(key) {
            return key && key != 'get'
        }
    )
}

this.shownCategories = new ReactiveVar(this.filters.get(), function (a, b) {
    console.log('compare')
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    if (a.length != b.length)
        return false;

    for (var i = 0; i < a.length; ++i)
        if (a[i] !== b[i])
            return false;
    return true;
})
