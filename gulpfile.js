'use strict';

/**
 * gulp-cache-bust-meta is a Gulp plugin for hash based (meta) cache busting
 *
 * @see https://github.com/jkphl/gulp-cache-bust-meta
 *
 * @author Joschi Kuphal <joschi@kuphal.net> (https://github.com/jkphl)
 * @copyright © 2016 Joschi Kuphal
 * @license MIT https://raw.github.com/jkphl/gulp-cache-bust-meta/master/LICENSE
 */

var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('lint', function () {
    gulp.src(['test/*.js', 'index.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'))
});

gulp.task('default', ['lint']);
