var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	rimraf = require('rimraf'),
	gutil = require('gutil'),
	webpack = require('webpack'),
	sourcemaps = require('gulp-sourcemaps');

var webpackprod = require('./webpack.config.prod');

const devServer = () => {
	require('./devServer.js');
}

gulp.task('sass', () => {
	return gulp.src('assets/scss/main.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(autoprefixer())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('build'));
});

gulp.task('sass:build', () => {
	return gulp.src('assets/scss/main.scss')
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(autoprefixer())
		.pipe(gulp.dest('build'));
});


gulp.task('sass:watch', () => {
	gulp.watch('assets/scss/**/*.scss', ['sass']);
});

gulp.task('clean', (cb) => {
	rimraf('./build', cb);
});

gulp.task('webpack:build', () => {
	webpack(webpackprod, (err, stats) => {
		if (err) throw new gutil.PluginError("webpack-build", err);
		gutil.log("[webpack-build]", stats.toString({colors: true}));
	});
});

gulp.task('dev', [], done => devServer());

gulp.task('build', ['clean', 'sass:build']);

gulp.task('default', ['dev', 'sass', 'sass:watch']);