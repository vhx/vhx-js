var gulp           = require('gulp');
var browserify     = require('browserify');
var babelify       = require('babelify');
var source         = require('vinyl-source-stream');
var buffer         = require('vinyl-buffer');
var uglify         = require('gulp-uglify');
var sourcemaps     = require('gulp-sourcemaps');

gulp.task('minified_build', function() {
  return browserify({entries: './lib/vhx.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('vhx.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist', { overwrite: true }));
});

gulp.task('maxified_build', function() {
  return browserify({entries: './lib/vhx.js'})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('vhx.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./dist', { overwrite: true }));
});

gulp.task('dev', function() {
  return browserify({entries: './lib/vhx.js'})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('vhx.js'))
        .pipe(buffer())
        .pipe(gulp.dest('../crystal/vendor/assets/javascripts', { overwrite: true }));
});

gulp.task('default', ['maxified_build', 'minified_build']);
