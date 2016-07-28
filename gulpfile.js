var gulp           = require('gulp');
var browserify     = require('browserify');
var babelify       = require('babelify');
var source         = require('vinyl-source-stream');
var buffer         = require('vinyl-buffer');
var uglify         = require('gulp-uglify');
var sourcemaps     = require('gulp-sourcemaps');
var gulpBrowserify = require('gulp-browserify');
var babel          = require('gulp-babel');

gulp.task('regbuild', function() {
  gulp.src('lib/vhx.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulpBrowserify())
    .pipe(gulp.dest('dist'))
});

gulp.task('minbuild', function() {
  return browserify({entries: './lib/vhx.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('vhx.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['regbuild', 'minbuild']);
