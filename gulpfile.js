"use strict";
const jshint = require('gulp-jshint');
const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('lint', function() {
	return gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(jshint({esversion: 6, node: true}))
    .pipe(jshint.reporter('default'));
});

gulp.task('test', () => {
	return gulp.src('test/test.js', {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('default', ['lint', 'test']);
