const paths = require('./paths');
const gulp = require('gulp');
const modernizr = require('gulp-modernizr');
const uglify = require('gulp-uglify');

module.exports = function buildModernizr() {
  return gulp.src([paths.devJs + '**/*.js', paths.devScss + '**/*.scss'])
    .pipe(modernizr('modernizr-custom.js', {
      options: [
        'setClasses',
        'addTest',
        'html5printshiv',
        'testProp',
        'fnBind'
      ],
      excludeTests: ['hidden', 'progressbar', 'meter']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.buildJs))
};
