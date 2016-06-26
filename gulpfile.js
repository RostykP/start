
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');


var js_arr = [
    'node_modules/bootstrap-daterangepicker/moment.js',
    'node_modules/bootstrap-daterangepicker/daterangepicker.js',
    'node_modules/jquery.cookie/jquery.cookie.js',
    'js/custom/*.js'
];

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/custom/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'));
});
//Copy jquery
gulp.task('copy-files', function () {
    return gulp.src(['node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('js/'));
});



// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(js_arr)
        .pipe(concat('script.js'))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js'));



});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/custom/*.js', ['lint', 'scripts']);
    gulp.watch('scss/**/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'copy-files','sass', 'scripts', 'watch']);