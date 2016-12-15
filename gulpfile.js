'use strict';

/* eslint-env node */

const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const jshint = require('gulp-jshint');
const zip = require('gulp-zip');

const lintable = [
  'gulpfile.js',
  'src/**/*.js'
];

gulp.task('default', ['eslint', 'jshint', 'clean', 'build']);
gulp.task('lint', ['eslint', 'jshint', 'lwatch']);

gulp.task('clean', () =>
  del([
    'dist/*'
  ])
);

gulp.task('eslint', () =>
  gulp.src(lintable)
  .pipe(eslint())
  .pipe(eslint.format())
  .on('error', (error) => {
    console.error(error.toString()); // eslint-disable-line no-console
    this.emit('end');
  })
);

gulp.task('jshint', () =>
  gulp.src(lintable)
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
);

gulp.task('build', () =>
  gulp.src('src/*.js')
  .pipe(zip('AlexaSuggestions.zip'))
  .pipe(gulp.dest('dist'))
);

gulp.task('watch', () =>
  gulp.watch(lintable, ['jshint', 'eslint', 'build'])
);

gulp.task('lwatch', () =>
  gulp.watch(lintable, ['jshint', 'eslint'])
);
