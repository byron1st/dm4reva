const gulp = require('gulp')
const del = require('del')
const babel = require('gulp-babel')

gulp.task('clean', () => {
  return del('dist/*', {force:true})
})

gulp.task('copy:js', () => {
  return gulp.src([
      './src/*.js',
      './src/db/*',
      './src/compiled/*',
      './src/view/js/*'
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

gulp.task('default', ['clean', 'copy:js', 'copy:view'])
