const { promisify } = require('util');
const readFile = promisify(require('fs').readFile);
const ejs = require('ejs');
const { getOptions } = require('loader-utils');
const path = require('path');

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

            const addDependencies = async dependency => {
                if (!this.getDependencies().includes(dependency)) {
                    this.addDependency(dependency);
                }

                const source = await readFile(dependency, 'utf8');
                const dependencies = getDependencies(source, path.join(dependency, '..'));
                await Promise.all(dependencies.map(addDependencies));

                return Promise.resolve();
            }

            const dependencies = getDependencies(source, path.join(options.filename, '..'));
            await Promise.all(dependencies.map(addDependencies));
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

function getDependencies(source, sourcePath) {
    let dependecies = [];
    const dependencyPattern = /<%[_\W]?\s*include\(['"`](.*)['"`]/g;

    let matches = dependencyPattern.exec(source);
    while (matches) {
        const fileName = matches[1].endsWith('.ejs') ? matches[1] : `${matches[1]}.ejs`;

        if (!dependecies.includes(matches)) {
            dependecies.push(path.join(sourcePath, fileName));
        }
        matches = dependencyPattern.exec(source);
    }

    return dependecies;
}