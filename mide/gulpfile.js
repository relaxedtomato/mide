var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var plumber = require('gulp-plumber');
var runSeq = require('run-sequence');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var karma = require('karma').server;
var mocha = require('gulp-mocha');

var paths = {
  sass: ['./scss/**/*.scss'],
  images : ['./development/img/*'],
  exercism : ['./development/exercism/javascript/**/*']
};

// gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

// gulp.task('watch', function() {
//   gulp.watch(paths.sass, ['sass']);
// });

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

// ------------------------------------------------------
// Javascript
// ------------------------------------------------------

gulp.task('lintJS', function () {
    return gulp.src(['./development/features/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('buildJS', function () {
    return gulp.src(['./development/features/app.js', './development/features/**/*.js'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        // .pipe(babel())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./www/features'));
});

gulp.task('buildJSProduction', function () {
    return gulp.src(['./development/features/app.js', './development/features/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(babel())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest('./www/features'));
});

// ------------------------------------------------------
// Exercism
// ------------------------------------------------------

gulp.task('moveExercism', function () {
    return gulp.src(['./development/exercism/**/*.spec.js', './development/exercism/**/*.md'])
        .pipe(gulp.dest('./www/exercism/'));
});

// ------------------------------------------------------
// HTML
// ------------------------------------------------------
gulp.task('moveHTML', function () {
    return gulp.src(['./development/features/**/*.html'])
        .pipe(gulp.dest('./www/features'));
});

gulp.task('moveIndexHTML', function(){
  return gulp.src(['./development/index.html'])
    .pipe(gulp.dest('./www/'));
});

gulp.task('buildHTML', ['moveHTML', 'moveIndexHTML']);

// ---------------------------------------------------------
// Images
// ---------------------------------------------------------

gulp.task('moveImages', function () {
    return gulp.src(['./development/img/*'])
        .pipe(gulp.dest('./www/img'));
});

// ------------------------------------------------------
// Testing
// ------------------------------------------------------
/**
 * Test task, run test continuously
 */
gulp.task('test', function(done) {
    karma.start({
        configFile: __dirname + '/my.conf.js'//,
        //singleRun: true //runs only once.
    }, function() {
        done();
    });
});
// ------------------------------------------------------
// Compose Tasks
// ------------------------------------------------------

gulp.task('build', function () {
    if (process.env.NODE_ENV === 'production') {
        runSeq(['buildJSProduction', 'sass', 'buildHTML', 'moveImages', 'moveExercism']);
    } else {
        runSeq(['buildJS', 'sass', 'buildHTML', 'moveImages', 'moveExercism']);
    }
});

gulp.task('default', function(){
  gulp.start('build', 'test');

  gulp.watch('development/features/**', function(){
    runSeq('lintJS', 'buildJS', 'buildHTML');
  });

  gulp.watch(paths.exercism, ['moveExercism']);

  gulp.watch("development/tests/*", function (){
       runSeq('test');
    });

  gulp.watch(paths.images, ['moveImages']);

  gulp.watch(paths.sass, ['sass']);

});

