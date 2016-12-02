'use strict';

var cachebust = require('../');
var should = require('should');
var assert = require('stream-assert');
var path = require('path');
var File = require('vinyl');
var gulp = require('gulp');
require('mocha');

var fixtures = function (glob) {
    return path.join(__dirname, 'fixtures', glob);
};

describe('gulp-cache-bust-meta', function () {
    describe('cachebust()', function () {
        // it('should throw, when base directory is missing', function () {
        //     concat.should.throw('gulp-cache-bust-meta: Missing base directory');
        // });
        //
        // it('should throw, when base directory is not a path', function () {
        //     concat.bind(null, true).should.throw('gulp-cache-bust-meta: Base directory must be a directory path');
        // });
        //
        // it('should throw, when the base directory doesn\'t exist', function () {
        //     concat.bind(null, 'invalid-directory').should.throw('gulp-cache-bust-meta: Base directory doesn\'t exist');
        // });
        //
        // it('should throw, when the base directory is not a directory', function () {
        //     concat.bind(null, 'index.js').should.throw('gulp-cache-bust-meta: Base directory doesn\'t exist');
        // });
        //
        // it('should ignore null files', function (done) {
        //     var stream = concat(fixtures(''));
        //     stream
        //         .pipe(assert.length(0))
        //         .pipe(assert.end(done));
        //     stream.write(new File());
        //     stream.end();
        // });

        it('should work', function (done) {
            gulp.src(fixtures('*'))
                .pipe(cachebust())
                .pipe(assert.end(done));
        });

        // it('should concat one file', function (done) {
        //     test('wadap')
        //         .pipe(concat(fixtures('')))
        //         .pipe(assert.length(1))
        //         .pipe(assert.first(function (d) {
        //             d.basename.should.eql('file0.txt');
        //             d.contents.toString().should.eql('wadap');
        //         }))
        //         .pipe(assert.end(done));
        // });
        //
        // it('should concat multiple files', function (done) {
        //     gulp.src(fixtures('**/*'))
        //         .pipe(sort())
        //         .pipe(concat(fixtures(''), 'js'))
        //         .pipe(assert.length(3))
        //         .pipe(assert.first(function (d) {
        //             d.basename.should.eql('01_first.txt');
        //             d.contents.toString().should.eql('1');
        //         }))
        //         .pipe(assert.second(function (d) {
        //             d.basename.should.eql('02_second.js');
        //             d.contents.toString().should.eql('2.1\n\n2.2.1\n\n2.3\n');
        //         }))
        //         .pipe(assert.nth(3, function (d) {
        //             d.basename.should.eql('03_third.txt');
        //             d.contents.toString().should.eql('3');
        //         }))
        //         .pipe(assert.end(done));
        // });
        //
        // it('should concat buffers', function (done) {
        //     test(function () {
        //         return 'test';
        //     }, [65, 66], [67, 68], [69, 70])
        //         .pipe(concat(fixtures('')))
        //         .pipe(assert.length(1))
        //         .pipe(assert.first(function (d) {
        //             d.basename.should.eql('test');
        //             d.contents.toString().should.eql('AB\nCD\nEF');
        //         }))
        //         .pipe(assert.end(done));
        // });
        //
        // it('should preserve mode from files', function (done) {
        //     test('wadaup')
        //         .pipe(concat(fixtures('')))
        //         .pipe(assert.length(1))
        //         .pipe(assert.first(function (d) {
        //             d.basename.should.eql('file0.txt');
        //             d.stat.mode.should.eql(parseInt('0666', 8));
        //         }))
        //         .pipe(assert.end(done));
        // });
        //
        // it('should support source maps', function (done) {
        //     gulp.src(fixtures('02_second/**/*'))
        //         .pipe(sourcemaps.init())
        //         .pipe(concat(fixtures(''), 'js'))
        //         .pipe(assert.length(1))
        //         .pipe(assert.first(function (d) {
        //             d.sourceMap.sources.should.have.length(3);
        //             d.sourceMap.file.should.eql('02_second.js');
        //         }))
        //         .pipe(assert.end(done));
        // });
        //
        // describe('should not fail if no files were input', function () {
        //     it('when argument is a string', function (done) {
        //         var stream = concat(fixtures(''));
        //         stream.end();
        //         done();
        //     });
        // });
        //
        // describe('options', function () {
        //     it('should support newLine', function (done) {
        //         test(function () {
        //             return 'test';
        //         }, 'wadap', 'doe')
        //             .pipe(concat(fixtures(''), null, {newLine: '\r\n'}))
        //             .pipe(assert.length(1))
        //             .pipe(assert.first(function (d) {
        //                 d.contents.toString().should.eql('wadap\r\ndoe');
        //             }))
        //             .pipe(assert.end(done));
        //     });
        //
        //     it('should support empty newLine', function (done) {
        //         test(function () {
        //             return 'test';
        //         }, 'wadap', 'doe')
        //             .pipe(concat(fixtures(''), null, {newLine: ''}))
        //             .pipe(assert.length(1))
        //             .pipe(assert.first(function (d) {
        //                 d.contents.toString().should.eql('wadapdoe');
        //             }))
        //             .pipe(assert.end(done));
        //     });
        // });
    });
});