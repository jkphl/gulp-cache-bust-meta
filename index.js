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

var through = require('through2');
var path = require('path');
var fs = require('fs');
var hash = require('./lib/hash');
var vinylFile = require('vinyl-file');

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
 * @returns {*} Transform
 */
module.exports = function (map, opt) {

    // Sanitize options / set defaults
    opt = opt || {};
    opt.hashLength = parseInt(opt.hashLength) || 8;
    opt.separator = ('separator' in opt) ? opt.separator : '.';
    opt.metaHashPlaceholder = opt.metaHashPlaceholder || '@@metaHash';

    // Variables
    var hashReplacements = {};
    var hashes = [];
    var sourceFiles = [];
    var templates = [];

    // Validate & prepare the replacement templates
    if (map && (map.constructor === Object) && Object.keys(map).length) {
        for (var from in map) {

            // Fail if replacement name is invalid
            if ((typeof map[from] !== 'string') || (map[from].constructor !== String) || !map[from].trim().length) {
                throw new Error('gulp-cache-bust-meta: Template target path is invalid');
            }

            try {
                var templateFile = vinylFile.readSync(from);
                if (!templateFile.stat.isFile()) {
                    throw 'error';
                }
                templateFile.path = map[from];
                templates.push(templateFile);

            } catch (e) {
                throw new Error('gulp-cache-bust-meta: Template "' + from + '" is invalid');
            }
        }
    }

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
        if (file.isStream()) {
            this.emit('error', new Error('gulp-cache-bust-meta: Streaming not supported'));
            cb();
            return;
        }

        // Calculate the content hash and file name replacement
        var fileContentHash = hash(file.contents, opt.hashLength);
        var fileExtension = path.extname(file.path);
        var fileRelativePath = file.relative;
        var fileRelativeDir = path.dirname(fileRelativePath);
        fileRelativeDir = fileRelativeDir.length ? (fileRelativeDir + path.sep) : '';
        var fileHashedName = path.basename(fileRelativePath, fileExtension) + opt.separator + fileContentHash + fileExtension;

        // Register the file name replacement
        hashReplacements[fileRelativePath] = fileRelativeDir + fileHashedName;

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

        // Process the replacement templates
        templates.forEach(function (template) {
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
