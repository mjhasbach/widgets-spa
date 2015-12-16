Template.users.helpers(
    {
        cols: function() {
            return [
                {name: 'Avatar', data: 'gravatar', type: 'image'},
                {name: 'ID', data: 'id', type: 'number'},
                {name: 'Name', data: 'name', type: 'text'}
            ];
        }
    }
);