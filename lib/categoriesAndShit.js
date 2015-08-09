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
