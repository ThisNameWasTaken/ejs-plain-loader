# ejs-plain-loader

[![npm](https://img.shields.io/npm/v/ejs-plain-loader.svg)](https://www.npmjs.com/package/ejs-plain-loader)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/ThisNameWasTaken/ejs-plain-loader/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/ThisNameWasTaken/ejs-plain-loader.svg?branch=master)](https://travis-ci.org/ThisNameWasTaken/ejs-plain-loader)
[![dependency Status](https://david-dm.org/ThisNameWasTaken/ejs-plain-loader/status.svg)](https://david-dm.org/ThisNameWasTaken/ejs-plain-loader#info=dependencies)
[![devDependency Status](https://david-dm.org/ThisNameWasTaken/ejs-plain-loader/dev-status.svg)](https://david-dm.org/ThisNameWasTaken/ejs-plain-loader#info=devDependencies)

[EJS](http://www.embeddedjs.com/) (Embeded JavaScript) loader for [Webpack](http://webpack.js.org). It converts EJS templates to plain HTML using the [EJS npm package](https://www.npmjs.com/package/ejs).

## Instalation
```
    npm install --save-dev ejs-plain-loader
```

__NOTE:__ EJS is a peer dependency so you may also need to install it.

```
    npm install --save-dev ejs
```

## Usage
Inside your `webpack config file` add the fallowing rules
```js
    module.exports = {
        ...

        module: {
        rules: [{
            test: /\.ejs$/i,
            use: {
                loader: 'ejs-plain-loader'
            }
        }]

        ...
    }
```

You can chain the ejs-plain-loader with other loaders such as the [html-loader](https://www.npmjs.com/package/html-loader)

```js
    module.exports = {
        ...

        module: {
        rules: [{
            test: /\.ejs$/i,
            use: [{
                loader: 'html-loader',
                options: {
                    attrs: [':src', ':data-src', 'source:srcset', 'source:data-srcset'], // load(require) images, videos or other resources
                    interpolate: true
                }
            }, {
                loader: 'ejs-plain-loader'
            }]
        }]

        ...
    }
```

## Options
See [EJS options](https://www.npmjs.com/package/ejs#options)

## More info
For more info on how to use EJS visit their [npm package page](https://www.npmjs.com/package/ejs) or their [official website](http://ejs.co/)