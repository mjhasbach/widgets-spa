Template.toolbar.created = () => {
    var helpers = {};

    _.each(Blaze._globalHelpers.tabs(), (tab) => {
        helpers[`${tab}Count`] = () => {
            return Session.get(`${tab}Count`);
        };
    });

    Template.toolbar.helpers(helpers);
};

Template.toolbar.rendered = () => {
    var items = $('.ui.menu > .item');

    items.filter(`.${Blaze._globalHelpers.defaultTab()}`).addClass('active');
    items.tab();
};