Template.add_edit_widget.rendered = () => {
    var $modal = $('.ui.modal'),
        $form = $modal.find('.ui.form'),
        getData = Template.instance().data.tab.getData,
        hideMessages = () => {
            $modal.find('.message').hide();
        };

    $('.add.widget').click(() => {
        Session.set('widgetAddEditMode', 'add');
        $('.ui.modal .ui.form').form('clear');
        $('.ui.modal').modal('show');
    });

    $modal.modal(
        {
            onShow: hideMessages,
            onHide: getData,
            onDeny: getData
        }
    );

    $modal.find('.submitForm.button').click(() => {
        $form.submit();
    });

    $modal.find('.clearForm.button').click(() => {
        $form.form('clear');
    });

    $form.find('.ui.dropdown').dropdown();
    $form.find('input').bind('focus change', hideMessages);

    $form.form(
        {
            inline: true,
            fields: {
                name: {
                    identifier: 'name',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Please enter a name'
                        }
                    ]
                },
                skills: {
                    identifier: 'color',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Please enter a color'
                        }
                    ]
                },
                gender: {
                    identifier: 'price',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Please enter a price'
                        }
                    ]
                },
                username: {
                    identifier: 'inventory',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Please enter an inventory quantity'
                        }
                    ]
                },
                password: {
                    identifier: 'melts',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Please choose yes or no'
                        }
                    ]
                }
            }
        }
    );

    // I had some issues with the API.
    // When adding a widget...
        // When using content type application/json...
            // melts = true adds the widget, but triggers a jQuery parse error
            // melts = false fails to add the widget and triggers a no 'Access-Control-Allow-Origin' error
        // When using content type x-www-form-urlencoded, the widget is added, but melts always = true
    // When editing a widget...
        // When using content type application/json, the widget is saved correctly
        // When using content type x-www-form-urlencoded, the widget is saved, but melts always = true
    // I have also tried other variations...
        // Omitting the melts property when melts = false
        // Setting melts to null / undefined / "off"
    // Other applicants have apparently run in to the same issue:
        // https://github.com/KyleRoss/widgets-spa
        // https://github.com/remoteportal/widgets-spa
    // So I settled on the following contrived method of adding / editing widgets:
    $form.submit(function(e) {
        if ($form.form('validate form')) {
            var params = {},
                data = $(this).serializeObject(),
                editing = Session.get('widgetAddEditMode') === 'edit';

            data.inventory = Number(data.inventory);
            data.melts = data.melts === 'Yes';

            params = {
                data: editing ? JSON.stringify(data) : data,
                url: `${Session.get('apiURL')}widgets${editing ? `/${data.id}` : ''}`,
                method: editing ? 'PUT' : 'POST',
                contentType: editing ? 'application/json; charset=utf-8' : undefined,
                dataType: editing ? 'json' : undefined
            };

            $.ajax(params).done(() => {
                $modal.find('.successful.message').show();
            }).fail(() => {
                $modal.find('.failure.message').show();
            });
        }

        e.preventDefault();
    });
};

Template.add_edit_widget.helpers(
    {
        addEditMode() {
            return Session.get('widgetAddEditMode');
        }
    }
);