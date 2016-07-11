const gulp = require('gulp')
const del = require('del')
const babel = require('gulp-babel')

gulp.task('clean', () => {
  return del.sync([
    'dist/**/**/*',
    'dist/*',
    'db/*'
  ])
})

gulp.task('compile:js', () => {
  return gulp.src([
      './src/*.js',
      './src/view/js/*.js',
      './src/components/*.jsx'
    ])
    .pipe(babel())
    .pipe(gulp.dest('./dist'))
})

gulp.task('copy:view', () => {
  return gulp.src([
    './src/view/*.html',
    './src/view/css/*'
  ])
  .pipe(gulp.dest('./dist'))
})

gulp.task('default', ['clean', 'compile:js', 'copy:view'])
