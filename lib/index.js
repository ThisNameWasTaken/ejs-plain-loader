const { readFileSync } = require('fs');
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

    const compileEjs = (source, cb) => {
        try {
            const addDependencies = dependency => {
                if (!this.getDependencies().includes(dependency)) {
                    this.addDependency(dependency);
                }

                const source = readFileSync(dependency, 'utf8');
                const dependencies = getDependencies(source, path.join(dependency, '..'));
                dependencies.map(addDependencies);
            }

            const dependencies = getDependencies(source, path.join(options.filename, '..'));
            dependencies.map(addDependencies);

            const template = ejs.compile(source, options);

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
    return getEjsDependencies(source, sourcePath).concat(getRequireDependencies(source, sourcePath));
}

function getRequireDependencies(source, sourcePath) {
    let dependecies = [];
    const requirePattern = /<%[\s\S]*?require\(['"`](.*)['"`]\)[\s\S]*?%>/g;

    let matches = requirePattern.exec(source);
    while (matches) {
        const fileName = matches[1];
        const filePath = path.join(sourcePath, fileName);

        dependecies.push(filePath);
        matches = requirePattern.exec(source);
    }

    return dependecies;
}

function getEjsDependencies(source, sourcePath) {
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

    const requirePattern = /<%[\s\S]*?require\(['"`](.*)['"`]\)[\s\S]*?%>/g;

    let matches = requirePattern.exec(source);
    while (matches) {
        const fileName = matches[1];

        if (!fileName.endsWith('.js') &&
            !fileName.endsWith('.json')) {
            continue; // skip files that are not js or json
        }

        const filePath = path.join(sourcePath, '..', fileName);

        // replace the require statement with either the module export or json file
        const statementToReplace = new RegExp(`require\\(['"\`]${fileName}['"\`]\\)`);

        if (fileName.endsWith('.js')) {
            // evaluate the javascript inside the required file and replace require statement with that
            const fileContent = eval(readFileSync(filePath, 'utf8'));
            const stringifiedObject = JSON.stringify(fileContent, serialize)
                .replace(/(\\")|`/g, "\\`") // escape double quotes and backticks
                .replace(/(\${[\s\S]*?})/g, "\\$1"); // escape the '$' symbol when used for string interpolation 
            source = source.replace(statementToReplace, `JSON.parse(\`${stringifiedObject}\`, ${unserialize.toString()})`); // since we are injecting a serialized json object into the file we have to parse it in order to use it as a js object
        } else if (fileName.endsWith('.json')) {
            // replace the require statement with the json file
            const fileContent = readFileSync(filePath, 'utf8');
            source = source.replace(statementToReplace, fileContent);
        }

        matches = requirePattern.exec(source);
    }
    return source;
}

const serialize = (key, val) => typeof val === 'function' ? '__isFunc:' + val.toString().replace(/\r|\n/g, '') : val;
const unserialize = (key, val) => typeof val === 'string' && val.startsWith('__isFunc:' + 'function') ? eval('(' + val.replace('__isFunc:', '') + ')') : val;