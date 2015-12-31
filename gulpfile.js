'use strict';

// general
var gulp = require('gulp');

//images
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');

var runSequence = require('run-sequence');

var sourceDir = 'client-src';
var destDir = 'public';

var config = {
    cssSrcDir: sourceDir + '/scss',
    jsSrcDir: sourceDir + '/js',
    imgSrcDir: sourceDir + '/imgs',
    polymerSrcDir: sourceDir + '/polymer-components',
    autoprefixer: {
        browsers: ['> 1%', 'last 2 versions'],
        cascade: true,
        remove: true
    }
};

gulp.task('build', function (cb) {
    runSequence(['copy', 'images'], cb);
});

gulp.task('copy', function () {
    var files = ['./**/bower_components/**/*'];

    gulp.src(files)
        .pipe(gulp.dest(destDir));
});

gulp.task('images', function () {

    // negate sprites from the glob
    var files = [
        '!' + config.imgSrcDir + '/sprites/*.png',
        config.imgSrcDir + '/**/*.*'
    ];

    return gulp.src(files)
        .pipe(newer(destDir + '/imgs'))
        .pipe(imagemin())
        .pipe(gulp.dest(destDir + '/imgs'));
});