const { promisify } = require('util');
const readFile = promisify(require('fs').readFile);
const ejs = require('ejs');
const { getOptions } = require('loader-utils');

let cachedDependencies = {};

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

            cachedDependencies.source = [];

            const addDependencies = async dependency => {
                if (!this.getDependencies().includes(dependency)) {
                    this.addDependency(dependency);
                    cachedDependencies.source.push(dependency);
                }

                const source = await readFile(dependency, 'utf8');
                const subTemplate = ejs.compile(source, Object.assign(options, { filename: dependency }));
                if (subTemplate.dependencies.length) {
                    await Promise.all(subTemplate.dependencies.map(addDependencies));
                }

                return Promise.resolve();
            }

            await Promise.all(template.dependencies.map(addDependencies));
            cb(null, template(options.data || {}));
        } catch (error) {
            if (cachedDependencies.source) {
                cachedDependencies.source.forEach(this.addDependency);
            }
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