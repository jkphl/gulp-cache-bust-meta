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

const crypto = require('crypto');

/**
 * Create a content based hash
 *
 * @param {String} str Content
 * @param {Number} length Hash length
 * @return {String} Content hash
 */
module.exports = function (str, length) {
    return crypto.createHash('md5').update(str).digest('hex').substr(0, Math.max(8, length || 0));
};
