'use strict';

var through = require('through2');
var path = require('path');
var fs = require('fs');
var File = require('vinyl');
var crypto = require('crypto');
var cloneStats = require('clone-stats');

/**
 * Concatenation by directory structure
 *
 * @param {String|Array} ext File extension
 * @param {Object} opt Options
 * @returns {*}
 */
module.exports = function (files, opt) {

    // Build a list of meta replacement files
    files = files || [];
    if (typeof files === 'string') {
        files = files.trim().length ? [files.trim()] : [];
    }

    opt = opt || {};
    opt.deleteOriginals = !!opt.deleteOriginals;
    opt.hashLength = parseInt(opt.hashLength) || 8;
    opt.separator = ('separator' in opt) ? opt.separator : '.';

    // Define a simple rtrim function
    var rtrim = function (str, strip) {
        while (str.length && strip.length && (str.substr(-strip.length) === strip)) {
            str = str.substr(0, str.length - strip.length);
        }
        return str;
    };
    var hashReplacements = [];
    var hashes = [];
    var targets = [];

    /**
     * Buffer incoming contents
     *
     * @param {File} file File
     * @param enc
     * @param {Function} cb Callback
     */
    function bufferContents(file, enc, cb) {

        // Ignore empty files
        if (file.isNull()) {
            cb();
            return;
        }

        var cwd = path.resolve(file.cwd || '.');
        var hash = crypto.createHash('md5').update(file.contents).digest('hex').substr(0, Math.max(8, opt.hashLength));
        var fileExtension = path.extname(file.path);
        var hashedFilename = path.dirname(file.path) + path.sep + path.basename(file.path, fileExtension) + opt.separator + hash + fileExtension;
        console.log(hashedFilename);

        // We don't do streams (yet)
        // if (file.isStream()) {
        //     this.emit('error', new Error('gulp-concat-flatten: Streaming not supported'));
        //     cb();
        //     return;
        // }


        cb();
    }

    /**
     * End the stream
     *
     * @param {Function} cb Callback
     */
    function endStream(cb) {

        cb();
        return;

        // If no files were passed in, no files go out ...
        if (!latestFile || (Object.keys(concats).length === 0 && concats.constructor === Object)) {
            cb();
            return;
        }

        // Run through all registered contact instances
        for (var targetBase in concats) {
            var joinedFile = new File({
                path: targetBase,
                contents: concats[targetBase].concat.content,
                stat: concats[targetBase].stats
            });
            if (concats[targetBase].concat.sourceMapping) {
                joinedFile.sourceMap = JSON.parse(concats[targetBase].concat.sourceMap);
            }
            this.push(joinedFile);
        }
        cb();
    }

    return through.obj(bufferContents, endStream);
};
