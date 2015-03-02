/* ----------------- DEPENDENCIES -----------------*/
var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var newer = require('gulp-newer');
var jsx = require('gulp-jsx');
var to5 = require('gulp-babel');

/* --------------------- PATHS ---------------------*/
var paths = {
  build: './build',
  source: './src',
  libs: ['./lib/react/react.js', './lib/superagent/superagent.js']
};

/* ------------------ WEB SERVER -------------------*/
gulp.task('server', function () {
  return connect.server({
    root: paths.build,
    livereload: true
  });
});

/* ---------------- FILE WATCHER ------------------*/
gulp.task('watcher', function () {
  gulp.watch([paths.source + '/scss/*.scss'], ['compile-sass']);
  gulp.watch([paths.source + '/*.html'], ['copy-html']);
  gulp.watch([paths.source + '/js/*.jsx'], ['handle-javascript']);
  gulp.watch([paths.source + '/img/**/*'], ['copy-images']);
});

/* ---------------- SOURCE TASKS ------------------*/
gulp.task('handle-javascript', function () {
  return gulp.src(paths.source + '/js/**/*.jsx')
    .pipe(connect.reload())
    .pipe(jsx())
    .pipe(to5())
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('compile-sass', function () {
  return gulp.src(paths.source + '/scss/**/*.scss')
    .pipe(sass())
    .pipe(connect.reload())
    .pipe(gulp.dest(paths.build + '/css'));
});

gulp.task('copy-html', function () {
  return gulp.src(paths.source + '/*.html')
    .pipe(connect.reload())
    .pipe(gulp.dest(paths.build));
});

gulp.task('copy-images', function () {
  return gulp.src(paths.source + '/img/**/*')
    .pipe(newer(paths.build + '/img'))
    .pipe(gulp.dest(paths.build + '/img'));
});

gulp.task('copy-libs', function () {
  return gulp.src(paths.libs)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(paths.build + '/js'));
});

gulp.task('build',
  ['handle-javascript', 'compile-sass', 'copy-html', 'copy-images', 'copy-libs']);

/* -------------------------------------------------*/

gulp.task('default', ['build', 'server', 'watcher']);
