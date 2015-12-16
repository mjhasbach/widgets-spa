Template.widgets.helpers(
    {
        cols() {
            return [
                {name: 'ID', data: 'id', type: 'number', min: 1},
                {name: 'Name', data: 'name', type: 'text'},
                {name: 'Color', data: 'color', type: 'text'},
                {name: 'Price', data: 'price', type: 'text'},
                {name: 'Inventory', data: 'inventory', type: 'number', gte: true},
                {name: 'Melts', data: 'melts', type: 'boolean'}
            ];
        }
    }
);