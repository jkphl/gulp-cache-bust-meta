# gulp-cache-bust-meta [![NPM version][npm-image]][npm-url] [![NPM downloads][npm-downloads]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url] [![Development Dependency Status][devdepstat-image]][devdepstat-url]

is a Gulp plugin that creates copies of files with content dependent hashes added to their file names, which is a common [cache busting technique](https://css-tricks.com/strategies-for-cache-busting-css/#article-header-id-2). Additionally, it creates a "meta hash" (which changes every time a source files changes) and triggers a simple templating process taking the source file changes into account.

## Installation

To install `gulp-cache-bust-meta` as a development dependency, simply run:

```shell
npm install --save-dev gulp-cache-bust-meta
```

## Usage

Add it to your `gulpfile.js` and use it like this:

```javascript
const gulp             = require('gulp');
const cacheBustMeta    = require('gulp-cache-bust-meta');

gulp.src(['path/to/assets/**/*'])
    .pipe(cacheBustMeta({'path/to/index-template.html': 'index.html'}))
    .pipe(gulp.dest('path/to/dist'));
```

Running the task on a source file structure like this:

```
path
`-- to
    |-- index-template.html
    `-- assets
        |-- js
        |   `-- main.js
        `-- css
            `-- main.css
```

would result in:

```
out
|-- index.html
|-- js
|   `-- main.5bbf5a52.js
`-- css
    `-- main.c193497a.css
```

In detail,

* the files `path/to/assets/js/main.js` and `path/to/assets/css/main.css` are copied to the destination (preserving the directory structure as yielded by the [glob](https://github.com/isaacs/node-glob) expression) with their names supplemented by a content based hash,
* the template `path/to/index-template.html` is copied to `index.html` in the destination directory with the following string replacements applied:

```
js/main.js      → js/main.5bbf5a52.js
css/main.css    → js/main.c193497a.css
@@metaHash      → js/83f914b4
```    

The meta hash change can e.g. be used for invalidating a cookie previously sent to a client.

## Signature

```
/**
 * Cache busting including (meta) hash replacement in template files
 *
 * @param {Object} map    Optional: Templates to process
 *                        {
 *                              '/path/to/template/file.xyz': 'target.xyz'
 *                        }
 * @param {Object} opt    Optional: Options, defaulting to
 *                        {
 *                              hashLength: 8,
 *                              separator: '.',
 *                              metaHashPlaceholder: '@@metaHash'
 *                        }
 * @returns {DestroyableTransform} Transform
 */
cacheBustMeta(map, opt);
```

The `map` argument may be empty if you don't want to process any templates.

The `opt` keys may be given individually. The default hash length of 8 characters may be altered by `hashLength`. The character(s) given by `separator` are used for prepending the hash when added to a file name. The template placeholder for the meta hash may be altered by `metaHashPlaceholder`. 

## Changelog

Please refer to the [changelog](CHANGELOG.md) for a complete release history.


## Legal

Copyright © 2016 Joschi Kuphal <joschi@kuphal.net> / [@jkphl](https://twitter.com/jkphl).

*gulp-cache-bust-meta* is licensed under the terms of the [MIT license](LICENSE).


[npm-url]: https://npmjs.org/package/gulp-cache-bust-meta
[npm-image]: https://badge.fury.io/js/gulp-cache-bust-meta.png
[npm-downloads]: https://img.shields.io/npm/dm/gulp-cache-bust-meta.svg

[travis-url]: http://travis-ci.org/jkphl/gulp-cache-bust-meta
[travis-image]: https://secure.travis-ci.org/jkphl/gulp-cache-bust-meta.png

[coveralls-url]: https://coveralls.io/r/jkphl/gulp-cache-bust-meta
[coveralls-image]: https://img.shields.io/coveralls/jkphl/gulp-cache-bust-meta.svg

[depstat-url]: https://david-dm.org/jkphl/gulp-cache-bust-meta
[depstat-image]: https://david-dm.org/jkphl/gulp-cache-bust-meta/status.svg
[devdepstat-url]: https://david-dm.org/jkphl/gulp-cache-bust-meta?type=dev
[devdepstat-image]: https://david-dm.org/jkphl/gulp-cache-bust-meta/dev-status.svg
