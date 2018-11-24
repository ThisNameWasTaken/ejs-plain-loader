const { promisify } = require('util');
const readFile = promisify(require('fs').readFile);
const ejs = require('./ejs');
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
            const template = ejs.compile(source, options);
            template.dependencies.map(dependency => !this.getDependencies().includes(dependency) && this.addDependency(dependency));

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
    const dependencyPattern = /<%[_\W]?\s*include((\(['"`](.*)['"`])|(\s+([^\s-]+)\s*[\W_]?%>))/g;

    let matches = dependencyPattern.exec(source);
    while (matches) {
        let fileName = matches[5] || matches[3];
        if (!fileName.endsWith('.ejs')) {
            fileName += '.ejs';
        }

        const filePath = path.join(sourcePath, fileName);

        if (!dependecies.includes(filePath)) {
            dependecies.push(filePath);
        }

        matches = dependencyPattern.exec(source);
    }

    return dependecies;
}

ejs.Template.prototype.parseTemplateText = function () {
    var str = this.injectRequiredFiles();
    var pat = this.regex;
    var result = pat.exec(str);
    var arr = [];
    var firstPos;

    while (result) {
        firstPos = result.index;

        if (firstPos !== 0) {
            arr.push(str.substring(0, firstPos));
            str = str.slice(firstPos);
        }

        arr.push(result[0]);
        str = str.slice(result[0].length);
        result = pat.exec(str);
    }

    if (str) {
        arr.push(str);
    }

    return arr;
}


ejs.Template.prototype.injectRequiredFiles = function () {
    let source = this.templateText;
    const sourcePath = this.opts.filename;

    const requirePattern = /require\(['"`](.*)['"`]\)/;

    let matches = requirePattern.exec(source);
    while (matches) {
        const fileName = matches[1];
        const filePath = path.join(sourcePath, '..', fileName);

        // Store required files as dependencies
        if (!this.dependencies.includes(filePath)) {
            this.dependencies.push(filePath);
        }

        // replace the require statement with the module export
        const fileContent = require(filePath);
        const statementToReplace = new RegExp(`require\\(['"\`]${fileName}['"\`]\\)`);
        const stringifiedObject = JSON.stringify(fileContent, serialize)
            .replace(/(\\")|`/g, "\\`") // escape double quotes and backticks
            .replace(/`[\s\S]*?(\${[\s\S]*})[\s\S]*?`/, (string, variable) => string.replace(variable, '\\' + variable)); // escape the '$' symbol when used for string interpolation
        source = source.replace(statementToReplace, `JSON.parse(\`${stringifiedObject}\`, ${unserialize.toString()})`); // since we are injecting a serialized json object into the file we have to parse it in order to use it as an object

        matches = requirePattern.exec(source);
    }
    return source;
}

const serialize = (key, val) => typeof val === 'function' ? '__isFunc:' + val.toString() : val;
const unserialize = (key, val) => typeof val === 'string' && val.startsWith('__isFunc:' + 'function') ? eval('(' + val.replace('__isFunc:', '') + ')') : val;