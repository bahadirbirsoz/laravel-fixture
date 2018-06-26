var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    riot = require('gulp-riot');
var pug = require('gulp-pug');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');


var config = {
    pugPath: "./pug/**/*.pug",
    publicDestination: "../public/",
    bowerPath: "./bower_components/",
};
var jsSrc = [
    config.bowerPath + 'jquery/dist/jquery.min.js',
    config.bowerPath + 'riot/riot.js',
    config.bowerPath + 'riot-route/dist/route.js',
    config.bowerPath + 'bootstrap/dist/js/bootstrap.js',
    'tags.js',
    'js/**/*.js'
];


var cssSrc = [
    config.bowerPath + 'bootstrap/dist/css/bootstrap.css',
    'css/**/*.css'
];


gulp.task('riot', function () {
    return gulp.src(config.pugPath)
        .pipe(pug({
            pretty: true
        }))
        .pipe(rename({extname: ".tag"}))
        .pipe(riot())
        .pipe(concat('tags.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('scripts', ['riot'], function () {
    gulp.src(jsSrc)
        .pipe(concat('app.min.js')) // cancatenation to file myproject.js
        //.pipe(uglify()) // uglifying this file
        //.pipe(header('/*! <%= pkg.name %> <%= pkg.version %> */\n', {pkg: pkg} )) // banner with version and name of package
        .pipe(gulp.dest(config.publicDestination)); // save file to destination directory
});

gulp.task('default', ["scripts", "css"], function () {
    gulp.watch("./pug/**/*", ['scripts']);
    gulp.watch("./js/**/*", ['scripts']);
    gulp.watch("./css/**/*", ['css']);
});


gulp.task('css', function () {
    return gulp.src(cssSrc)
        .pipe(concat('style.min.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(config.publicDestination));
});