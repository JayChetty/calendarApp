var PageView = require('./base');
var templates = require('../templates');
// var EarthCycles = require('../earth_cycles');


module.exports = PageView.extend({
    pageTitle: 'more info',
    template: templates.pages.info
});
