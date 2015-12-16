var getData = function() {
        var instance = Template.instance() || this,
            $dimmer = $(getTabSelector(instance)).find('.ui.dimmer'),
            tabName = instance.data.name;

        $dimmer.addClass('active');

        $.ajax(`${Session.get('apiURL')}${tabName}`).done((data) => {
            var boolCols = getBoolCols(instance),
                rows = instance.rows.get();

            rows.remove({});

            for (var row of data) {
                for (var name of boolCols) {
                    row[name] = row[name] ? 'Yes' : 'No';
                }

                rows.insert(row);
            }

            Session.set(`${tabName}Count`, data.length);
        }).fail(() => {
            console.error('Unable to fetch rows');
        }).always(() => {
            $dimmer.removeClass('active');
        });
    },
    bindEvents = () => {
        var instance = Template.instance(),
            filters = instance.filters.get(),
            tabSelector = getTabSelector(),
            filterEvents = _.reduce(instance.data.cols, (result, col) => {
                var filterSelector = `${tabSelector} .${col.data}`;

                result[`keyup ${filterSelector}, change ${filterSelector}`] = (e) => {
                    var val = e.currentTarget.value;

                    if (val === '') {
                        filters[col.data] = undefined;
                    }
                    else {
                        if (col.type === 'text') {
                            filters[col.data] = new RegExp(RegExp.escape(val), 'i');
                        }
                        else if (col.type === 'number') {
                            var num = Number(val);

                            filters[col.data] = col.gte ? {$gte: num} : num;
                        }
                        else {
                            filters[col.data] = val;
                        }
                    }

                    instance.filters.set(filters);
                };

                return result;
            }, {}),
            rowEvents = {
                'click .edit.widgets': function() {
                    Session.set('widgetAddEditMode', 'edit');
                    $('.ui.modal .ui.form').form('set values', this);
                    $('.ui.modal').modal('show');
                }
            };

        Template.tab.events(Object.assign(filterEvents, rowEvents));
    },
    getTabSelector = (instance) => {
        return `.tab[data-tab="${(instance || Template.instance()).data.name}"]`;
    },
    getBoolCols = (instance) => {
        return _.pluck(_.filter(instance.data.cols, 'type', 'boolean'), 'data');
    };

Template.tab.helpers(
    {
        tab() {
            return {
                getData: getData.bind(Template.instance())
            };
        },
        name() {
            return Template.instance().data.name;
        },
        cols() {
            return Template.instance().data.cols;
        },
        rows() {
            var instance = Template.instance();

            return instance.rows.get().find(
                _.omit(instance.filters.get(), _.isUndefined)
            );
        }
    }
);

Template.tab.created = function() {
    Object.assign(this, {
        filters: new ReactiveVar({}),
        rows: new ReactiveVar(new Mongo.Collection(null))
    });

    if (this.data.name === 'widgets') {
        Session.set('refreshWidgets', 'test!');
    }

    bindEvents();
};

Template.tab.rendered = () => {
    var $tab = $(getTabSelector()),
        name = Template.instance().data.name;

    if (name === Blaze._globalHelpers.defaultTab()) {
        $tab.addClass('active');
    }

    $tab.find('.selection.dropdown').dropdown();
    getData();
};