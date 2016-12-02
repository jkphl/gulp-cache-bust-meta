'use strict';

const through = require('through2');
const path = require('path');
const fs = require('fs');
const File = require('vinyl');
const hash = require('./lib/hash');
const cloneStats = require('clone-stats');
const vinylRead = require('vinyl-read');


/**
 * Concatenation by directory structure
 *
 * @param {String|Array} ext File extension
 * @param {Object} opt opt
 * @returns {*}
 */
module.exports = function (map, opt) {
    // Build a replacement template map
    if (!map || map.constructor !== Object || Object.keys(map).length === 0) {
        map = {};
    }

    opt = opt || {};
    opt.hashLength = parseInt(opt.hashLength) || 8;
    opt.separator = ('separator' in opt) ? opt.separator : '.';
    opt.metaHashPlaceholder = opt.metaHashPlaceholder || '@@metaHash';

    // Define a simple rtrim function
    var rtrim = function (str, strip) {
        while (str.length && strip.length && (str.substr(-strip.length) === strip)) {
            str = str.substr(0, str.length - strip.length);
        }
        return str;
    };
    var hashReplacements = {};
    var hashes = [];
    var sourceFiles = [];

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

        // We don't do streams (yet)
        // if (file.isStream()) {
        //     this.emit('error', new Error('gulp-concat-flatten: Streaming not supported'));
        //     cb();
        //     return;
        // }

        // Calculate the content hash and file name replacement
        var fileContentHash = hash(file.contents, opt.hashLength);
        var fileExtension = path.extname(file.path);
        var fileRelativePath = file.relative;
        var fileRelativeDir = path.dirname(fileRelativePath);
        fileRelativeDir = fileRelativeDir.length ? (fileRelativeDir + path.sep) : '';
        var fileName = path.basename(fileRelativePath);
        var fileHashedName = path.basename(fileRelativePath, fileExtension) + opt.separator + fileContentHash + fileExtension;
        var fileRelativeHashedPath = fileRelativeDir + fileHashedName;

        // Register the file name replacement
        hashReplacements[fileRelativePath] = fileRelativeHashedPath;

        // Register the hash
        hashes.push(fileContentHash);

        // Register the source file
        sourceFiles.push(file);

        cb();
    }

    /**
     * End the stream
     *
     * @param {Function} cb Callback
     */
    function endStream(cb) {

        // Register the hashed target files
        sourceFiles.forEach(function (file) {
            var targetFile = file.clone();
            targetFile.path = targetFile.base + hashReplacements[targetFile.relative];
            this.push(targetFile);
        }, this);

        // Calculate & register the meta hash
        hashReplacements[opt.metaHashPlaceholder] = hash(hashes.join('-'), opt.hashLength);

        // See if there are additional templates that should be parsed
        var templates = Object.keys(map);
        if (!templates.length) {
            cb();
            return;
        }

        vinylRead.sync(templates).forEach(function(template) {
            template.path = map[template.path];
            var templateContent = template.contents.toString();
            for (var repl in hashReplacements) {
                templateContent = templateContent.replace(repl, hashReplacements[repl]);
            }
            template.contents = Buffer.fromString ? Buffer.fromString(templateContent) : new Buffer(templateContent);
            this.push(template);
        }, this);
        cb();
    }

    return through.obj(bufferContents, endStream);
};
