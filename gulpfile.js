"use strict";
const jshint = require('gulp-jshint');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const path = require('path');
const addsrc = require('gulp-add-src');

const files = {
	source : path.join('src', '**', '*.js'),
	other : ['LICENSE', 'README', 'package.json']
}

gulp.task('lint', function() {
	return gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(jshint({esversion: 6, node: true}))
    .pipe(jshint.reporter('default'));
});

gulp.task('test', () => {
	return gulp.src('test/test.js', {read: false})
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('dist',['test'], function() {
	return gulp.src(files.source, {base: path.join(__dirname, 'src')})
	.pipe(addsrc(files.other))
    .pipe(gulp.dest('dist'))
});

gulp.task('default', ['lint', 'test']);
