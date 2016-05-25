const gulp = require('gulp')
const del = require('del')
const babel = require('gulp-babel')

gulp.task('clean', () => {
  return del.sync(['dist/**/**/*', 'dist/*'])
})

gulp.task('copy:lib', () => {
  return gulp.src([
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
    './node_modules/bootstrap/dist/css/bootstrap.min.css'
  ])
  .pipe(gulp.dest('./dist/lib/bootstrap'))
})

gulp.task('copy:js', () => {
  return gulp.src([
      './src/*.js',
      './src/db/*',
      './src/view/js/*',
      './src/components/exdef.view.jsx'
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

gulp.task('default', ['clean', 'copy:lib', 'copy:js', 'copy:view'])
