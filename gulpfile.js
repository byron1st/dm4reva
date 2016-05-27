const gulp = require('gulp')
const del = require('del')
const babel = require('gulp-babel')

gulp.task('clean', () => {
  return del.sync(['dist/**/**/*', 'dist/*', 'db/exdef.db'])
})

gulp.task('copy:bootstrap:js', () => {
  return gulp.src([
    './node_modules/bootstrap/dist/js/bootstrap.min.js'
  ])
  .pipe(gulp.dest('./dist/lib/bootstrap/js'))
})

gulp.task('copy:bootstrap:css', () => {
  return gulp.src([
    './node_modules/bootstrap/dist/css/bootstrap.min.css'
  ])
  .pipe(gulp.dest('./dist/lib/bootstrap/css'))
})

gulp.task('copy:bootstrap:fonts', () => {
  return gulp.src([
    './node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}'
  ])
  .pipe(gulp.dest('./dist/lib/bootstrap/fonts'))
})

gulp.task('compile:js', () => {
  return gulp.src([
      './src/*.js',
      './src/db/*.js',
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

gulp.task('default', ['clean', 'compile:js', 'copy:bootstrap:js', 'copy:bootstrap:css', 'copy:bootstrap:fonts', 'copy:view'])
