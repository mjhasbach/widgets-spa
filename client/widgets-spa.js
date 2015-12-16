_ = lodash;

var globalHelpers = {
    defaultTab() {
        return 'users';
    },
    tabs() {
        return ['users', 'widgets'];
    },
    equals(a, b) {
        return a === b;
    },
    property(obj, key) {
        return obj[key];
    },
    capitalize(word) {
        return _.capitalize(word);
    }
};

Session.set('apiURL', 'http://spa.tglrw.com:4000/');

_.each(globalHelpers, (helper, name) => {
    Template.registerHelper(name, helper);
});