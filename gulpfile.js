"use strict";
const jshint = require('gulp-jshint');
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const path = require('path');
const addsrc = require('gulp-add-src');
const clean = require('gulp-clean');
const argv = require('minimist')(process.argv.slice(2));

const sourcedir = path.resolve(__dirname, argv.sourcedir || 'src');
const distdir = path.resolve(__dirname, argv.distdir || 'dist');
const testdir = path.resolve(__dirname, argv.testdir || 'test');

const files = {
	source : path.join(sourcedir, '**', '*.js'),
	other : ['LICENSE', 'README*', 'package.json']
};

gulp.task('lint', () => {
	return gulp.src([path.join('**','*.js'), '!node_modules/**'])
    .pipe(jshint({esversion: 6, node: true}))
    .pipe(jshint.reporter('default'));
});

gulp.task('test', gulp.series('lint', () => {
	return gulp.src(path.join(testdir, 'test*.js'))
    .pipe(mocha({reporter: 'spec'}));
}));

gulp.task('clean', () => {
    return gulp.src(distdir, {read: false})
    .pipe(clean());
});

gulp.task('dist', gulp.series('clean', 'test', () => {
	return gulp.src(files.source, {base: path.resolve(__dirname, sourcedir)})
	.pipe(addsrc(files.other))
    .pipe(gulp.dest(distdir));
}));

gulp.task('default', gulp.series('lint', 'test'));
