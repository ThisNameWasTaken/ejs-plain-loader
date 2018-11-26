# ejs-plain-loader

[![npm](https://img.shields.io/npm/v/ejs-plain-loader.svg)](https://www.npmjs.com/package/ejs-plain-loader)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/ThisNameWasTaken/ejs-plain-loader/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/ThisNameWasTaken/ejs-plain-loader.svg?branch=master)](https://travis-ci.org/ThisNameWasTaken/ejs-plain-loader)
[![dependency Status](https://david-dm.org/ThisNameWasTaken/ejs-plain-loader/status.svg)](https://david-dm.org/ThisNameWasTaken/ejs-plain-loader#info=dependencies)
[![devDependency Status](https://david-dm.org/ThisNameWasTaken/ejs-plain-loader/dev-status.svg)](https://david-dm.org/ThisNameWasTaken/ejs-plain-loader#info=devDependencies)

[EJS](http://www.embeddedjs.com/) (Embeded JavaScript) loader for [Webpack](http://webpack.js.org). It converts EJS templates to plain HTML using the [EJS npm package](https://www.npmjs.com/package/ejs).

* [installation](#installation)
* [example](#example)
* [usage](#usage)
* [importing partials](#importing-partials)
* [importing js/json files](#importing-files)
* [tags](#tags)
* [options](#options)
* [more info](#more-info)

## <a name="installation"></a> Instalation
```
npm i -D ejs-plain-loader
```

## <a name="example"></a> EJS Example
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <%= include('partials/head.ejs') %>
</head>
<body>
    <%= include('partials/navbar.ejs') %>

    <main>
        <!-- ... -->
    </main>

    <%= include('partials/footer.ejs') %>
</body>
</html>
```

## <a name="installation"></a> Usage

__NOTE:__ You need to chain the ejs-plain-loader with an html loader such as the [html-loader](https://www.npmjs.com/package/html-loader) and use a template plugin such as the [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin). To install these run `npm i -D html-loader html-webpack-plugin`.

Inside your `webpack config file` add the fallowing rules
```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // ...
    module: {
        rules: [{
            test: /\.ejs$/i,
            use: [{
                loader: 'html-loader', // loader for html files goes here
                options: {
                    attrs: [':src', ':data-src', 'source:srcset', 'source:data-srcset'], // load(require) images, videos or other resources
                    interpolate: true
                }
            }, {
                loader: 'ejs-plain-loader'
            }]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({ // plugin for templates goes here
            template: './src/views/index.ejs'
        })
    ]
    // ...
}
```

## <a name="importing-partials"></a> Importing partials
```html
    <!-- plain import -->
    <%- include('partials/my-awesome-partial.ejs') %>

    <!-- appending data -->
    <%- include('partials/card.ejs', {
            title: 'Lorem ipsum',
            content: 'Lorem ipsum dolor sit amet',
            actions: ['read more', 'add to favorites']
    }) %>
```

_Example:_

`index.ejs`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <%- include('partials/header.ejs', {
            title: 'Webpack Starter App',
            author: 'John Doe',
            keywords: ['lorem', 'ipsum', 'dolor', 'sit', 'amet'],
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.'
    }) %>
</head>
<body>
    <%- include('partials/navbar.ejs') %>

    <main>
        <!-- MAIN CONTENT -->
    </main>
    
    <%- include('partials/footer.ejs') %>
</body>
</html>
```

`header.ejs`
```html
    <%
        if (typeof description === 'undefined')  description = 'placeholder';
        if (typeof keywords === 'undefined') keywords = ['placeholder'];
        if (typeof author === 'undefined') author = 'placeholder';
        if (typeof title === 'undefined') title = 'placeholder';
    %>

    <meta charset="UTF-8">
    <meta name="description" content="<%= description %>">
    <meta name="keywords" content="<%= keywords.join(',') %>">
    <meta name="author" content="<%= author %>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><%= title %></title>
```

__Note:__ When you import a file using the `import partials/navbar` syntax you have to use this syntax across all of the files you are including in `navbar.ejs`. 

_Example_:

`index.ejs`
```html
<!DOCTYPE html>
<html lang="en">
    ...
    <body>
    ...
    <%- include partials/navbar %>
    ...
    </body>
</html>
```
`navbar.ejs`
```html
<!DOCTYPE html>
<html lang="en">
    ...
    <body>
    ...
    <%- include('partials/navbar.ejs') %>   <!-- Throws an error -->
    <%- include partials/navbar %>          <!-- Works fine -->
    ...
    </body>
</html>
```

## <a name="importing-files"></a> Importing JavaScript or JSON files
`index.ejs`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <%- 
        const meta = require('../data/index-meta.js');
        include('partials/header.ejs', meta);
    %>
</head>
<!-- ... -->
</html>
```

`index-meta.js`
```js
module.exports = {
    title: 'Webpack Starter App',
    author: 'John Doe',
    keywords: ['lorem', 'ipsum', 'dolor', 'sit', 'amet'],
    description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.',
    customFunction: function() {
        // ...
    }
}
```

## <a name="tags"></a> Tags
See [tags](https://www.npmjs.com/package/ejs#tags)

## <a name="options"></a> Options
See [EJS options](https://www.npmjs.com/package/ejs#options)

## <a name="more-info"></a> More info
For more info on how to use EJS visit their [npm package page](https://www.npmjs.com/package/ejs) or their [official website](http://ejs.co/)