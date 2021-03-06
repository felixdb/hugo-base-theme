const gulp = require('gulp');
const imagemin = require("gulp-imagemin");
const imageresize = require('gulp-image-resize');
const parallel = require("concurrent-transform");
var runSequence = require('run-sequence');
var del = require('del');
var exec = require('child_process').exec;

// image resizing variables
const imagexl = 2620;
const imagefull = 1920;
const imagehalf = 1024;
const imagequart = 600;
const imagethumb = 80;

// clean images from dir
gulp.task("clean-image", function(){
  return del([
    'themes/themename/static/quart/**/*',
    'themes/themename/static/half/**/*',
    'themes/themename/static/thumb/**/*',
    'themes/themename/static/xl/**/*',
    'themes/themename/static/img/*',
    // we don't want to clean this file though so we negate the pattern
    '!themes/themename/static/img/icons'
  ]);
});
// resize and optimize images
gulp.task("image-resize", () => {
  return gulp.src("themes/themename/source-images/*.{jpg,png,jpeg,gif}")
    .pipe(imagemin())
    .pipe(imageresize({ width: imagexl}))
    .pipe(gulp.dest("themes/themename/static/xl/img"))
    .pipe(imageresize({ width: imagefull }))
    .pipe(gulp.dest("themes/themename/static/img"))
    .pipe(imageresize({ width: imagehalf }))
    .pipe(gulp.dest("themes/themename/static/half/img"))
    .pipe(imageresize({ width: imagequart }))
    .pipe(gulp.dest("themes/themename/static/quart/img"))
    .pipe(imageresize({ width: imagethumb }))
    .pipe(gulp.dest("themes/themename/static/thumb/img"));
});

// hugo production call
gulp.task("hugo", function (cb) {
  exec('hugo --cleanDestinationDir', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

// watching images and resizing
gulp.task("watch", function() {
  gulp.watch('themes/themename/source-images/*.{jpg,png,jpeg,gif}', function(){ runSequence('clean-image', 'image-resize') });
});

// watching images and resizing
gulp.task("dev",  function(callback) {
  runSequence('clean-image',
              'image-resize',
              'watch');
});

// optimizing images and calling hugo for production
gulp.task("prod",  function(callback) {
  runSequence('clean-image',
              'image-resize',
              'hugo');
});
