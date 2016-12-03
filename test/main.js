'use strict';

var cacheBustMeta = require('../');
var should = require('should');
var assert = require('stream-assert');
var path = require('path');
var fs = require('fs');
var File = require('vinyl');
var gulp = require('gulp');
var hash = require('../lib/hash.js');
require('mocha');

var fixtures = function (glob) {
    return path.join(__dirname, 'fixtures', glob);
};

var templates = {};
templates[fixtures('template.txt')] = 'template.txt';
var hash1 = hash('one\n', 8);
var hash2 = hash('two\n', 8);
var metaHash = hash([hash1, hash2].join('-'), 8);

describe('gulp-cache-bust-meta', function () {
    describe('cacheBustMeta()', function () {
        it('should throw, when an invalid template target is given', function () {
            cacheBustMeta.bind(null, {'/invalid/template': false}).should.throw('gulp-cache-bust-meta: Template target path is invalid');
        });

        it('should throw, when an invalid template file is given', function () {
            cacheBustMeta.bind(null, {'/invalid/template': 'fail'}).should.throw('gulp-cache-bust-meta: Template "/invalid/template" is invalid');
        });

        it('should ignore null files', function (done) {
            var stream = cacheBustMeta();
            stream
                .pipe(assert.length(0))
                .pipe(assert.end(done));
            stream.write(new File());
            stream.end();
        });

        it('should emit error on streamed file', function (done) {
            gulp.src(fixtures('*/**'), {buffer: false})
                .pipe(cacheBustMeta(templates))
                .once('error', function (err) {
                    err.message.should.eql('gulp-cache-bust-meta: Streaming not supported');
                    done();
                });
        });

        it('should work with a single source file', function (done) {
            gulp.src(fixtures('files/test1.txt'))
                .pipe(cacheBustMeta(templates))
                .pipe(assert.length(2))
                .pipe(assert.nth(0, function (d) {
                    path.basename(d.path).should.eql('test1.' + hash1 + '.txt');
                    d.contents.toString().should.eql('one\n');
                }))
                .pipe(assert.nth(1, function (d) {
                    path.basename(d.path).should.eql('template.txt');
                    d.contents.toString().should.eql(hash([hash1].join('-'), 8) + '@@altMetaHash\n');
                }))
                .pipe(assert.end(done));
        });

        it('should work with multiple source files', function (done) {
            gulp.src(fixtures('*/**'))
                .pipe(cacheBustMeta(templates))
                .pipe(assert.length(3))
                .pipe(assert.nth(0, function (d) {
                    path.basename(d.path).should.eql('test1.' + hash1 + '.txt');
                    d.contents.toString().should.eql('one\n');
                }))
                .pipe(assert.nth(1, function (d) {
                    path.basename(d.path).should.eql('test2.' + hash2 + '.txt');
                    d.contents.toString().should.eql('two\n');
                }))
                .pipe(assert.nth(2, function (d) {
                    path.basename(d.path).should.eql('template.txt');
                    d.contents.toString().should.eql(metaHash + '@@altMetaHash\n');
                }))
                .pipe(assert.end(done));
        });

        it('should work with a template only', function (done) {
            gulp.src(fixtures('none'))
                .pipe(cacheBustMeta(templates))
                .pipe(assert.length(1))
                .pipe(assert.nth(0, function (d) {
                    path.basename(d.path).should.eql('template.txt');
                    d.contents.toString().should.eql(hash('') + '@@altMetaHash\n');
                }))
                .pipe(assert.end(done));
        });

        it('should preserve mode from files', function (done) {
            gulp.src(fixtures('files/test1.txt'))
                .pipe(cacheBustMeta(templates))
                .pipe(assert.length(2))
                .pipe(assert.nth(0, function (d) {
                    var stat = fs.statSync(fixtures('files/test1.txt'));
                    path.basename(d.path).should.eql('test1.' + hash1 + '.txt');
                    d.stat.mode.should.eql(stat.mode);
                }))
                .pipe(assert.nth(1, function (d) {
                    var stat = fs.statSync(fixtures('template.txt'));
                    path.basename(d.path).should.eql('template.txt');
                    d.stat.mode.should.eql(stat.mode);
                }))
                .pipe(assert.end(done));
        });

        describe('options', function () {
            it('should support an alternate hash length', function (done) {
                gulp.src(fixtures('files/test1.txt'))
                    .pipe(cacheBustMeta(templates, {hashLength: 10}))
                    .pipe(assert.length(2))
                    .pipe(assert.nth(0, function (d) {
                        path.basename(d.path).should.eql('test1.' + hash('one\n', 10) + '.txt');
                        d.contents.toString().should.eql('one\n');
                    }))
                    .pipe(assert.nth(1, function (d) {
                        path.basename(d.path).should.eql('template.txt');
                        d.contents.toString().should.eql(hash(hash('one\n', 10), 10) + '@@altMetaHash\n');
                    }))
                    .pipe(assert.end(done));
            });

            it('should support an alternate separator', function (done) {
                gulp.src(fixtures('files/test1.txt'))
                    .pipe(cacheBustMeta(templates, {separator: '-'}))
                    .pipe(assert.length(2))
                    .pipe(assert.nth(0, function (d) {
                        path.basename(d.path).should.eql('test1-' + hash1 + '.txt');
                        d.contents.toString().should.eql('one\n');
                    }))
                    .pipe(assert.end(done));
            });

            it('should support an alternate meta hash placeholder', function (done) {
                gulp.src(fixtures('files/test1.txt'))
                    .pipe(cacheBustMeta(templates, {metaHashPlaceholder: '@@altMetaHash'}))
                    .pipe(assert.length(2))
                    .pipe(assert.nth(1, function (d) {
                        path.basename(d.path).should.eql('template.txt');
                        d.contents.toString().should.eql('@@metaHash' + hash([hash1].join('-'), 8) + '\n');
                    }))
                    .pipe(assert.end(done));
            });
        });
    });
});
