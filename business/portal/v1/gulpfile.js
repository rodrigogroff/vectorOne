var gulp = require("gulp");
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var prefix = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var imagemin = require('gulp-imagemin');

gulp.task('browserSync', function () {
    browserSync.init({
        port: 18523, // default: 3000
        server: {
            baseDir: 'app' // default : app
        }
    });
});

gulp.task('less-css', function () {
    gulp.src('app/assets/less/tovvl.less')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(prefix())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('app/assets/css'))
        .pipe(browserSync.stream())
});


gulp.task('less-skin', function () {
    gulp.src('app/assets/less/skins/*.less')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(prefix())
        .pipe(sourcemaps.write('./'))
        .pipe(rename({ prefix: 'tovvl.' }))
        .pipe(gulp.dest('app/assets/css'))
        .pipe(browserSync.stream())
});

// image Optimized
gulp.task('image-min', function () {
    return gulp.src('app/assets/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('app/assets/images'));
});

gulp.task('watch', ['browserSync'], function () {
    gulp.watch('./**/*.html').on('change', browserSync.reload)
    gulp.watch('./**/*.less', ['less-css']).on('change', browserSync.reload);
    gulp.watch('app/assets/less/skins/*.less', ['less-skin']).on('change', browserSync.reload);
});


gulp.task('default', ['watch', 'less-css', 'less-skin']);

