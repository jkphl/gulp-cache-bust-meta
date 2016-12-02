'use strict';

const crypto = require('crypto');

/**
 * Create a content hash
 *
 * @param {String} str Content
 * @param {Number} length Hash length
 * @return {String} Content hash
 */
module.exports = function (str, length) {
    return crypto.createHash('md5').update(str).digest('hex').substr(0, Math.max(8, length));
}
