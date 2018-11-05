const { promisify } = require('util');
const readFile = promisify(require('fs').readFile);
const ejs = require('ejs');
const { getOptions } = require('loader-utils');

module.exports = function (source, map, meta) {
    const callback = this.async();

    const options = Object.assign({
        filename: this.resourcePath,
        doctype: 'html',
        compileDebug: this.debug || false
    }, getOptions(this));

    const compileEjs = async (source, cb) => {
        try {
            const template = ejs.compile(source, options);

            const addDependencies = dependency => {
                this.addDependency(dependency);
                return readFile(dependency, 'utf8').then(source => {
                    const subTemplate = ejs.compile(source, Object.assign(options, { filename: dependency }));
                    if (subTemplate.dependencies.length) {
                        subTemplate.dependencies.forEach(this.addDependency);
                        return subTemplate.dependencies.map(addDependencies);
                    }
                    return Promise.resolve();
                }).catch(err => cb(err));
            }

            await Promise.all(template.dependencies.map(addDependencies));
            cb(null, template(options.data || {}));
        } catch (error) {
            cb(error);
        }
    }

    compileEjs(source, function (err, result) {
        if (err) {
            return callback(err);
        }
        callback(null, result, map, meta);
    });
}