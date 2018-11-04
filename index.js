const ejs = require('ejs');
const { getOptions } = require('loader-utils');

module.exports = function (source) {
    const options = Object.assign({
        filename: this.resourcePath,
        doctype: 'html',
        compileDebug: this.debug || false
    }, getOptions(this));

    const template = ejs.compile(source, options);
    template.dependencies.forEach(this.addDependency);
    return template(options.data || {});
}