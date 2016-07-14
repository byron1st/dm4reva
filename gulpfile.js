const gulp = require('gulp')
const del = require('del')
const babel = require('gulp-babel')
const shell = require('gulp-shell')
const fs = require('fs')
const plist = require('plist')

const srcList = [
  './src/*.js',
  './src/util/*.js',
  './src/components/*.jsx',
  './src/flux/*.js',
  './src/flux/actions/*.js',
  './src/view/js/*.js'
]
const versionNumber = '1.3.1'
const minifiedPackageJson = {
  "name": "dm4reva",
  "version": versionNumber,
  "description": "Datastore Manager for the Reconstruction of Execution View Architecture",
  "main": "dist/main.js",
  "author": "byron1st",
  "license": "MIT",
  "dependencies": {
    "bootstrap": "^3.3.6",
    "jquery": "^2.2.4",
    "nedb": "^1.8.0",
    "react": "^15.2.1",
    "react-dom": "^15.2.1",
    "showdown": "^1.4.1"
  }
}
const programName = 'DM4REVA'
const programAppName = 'DM4REVA_v' + versionNumber
const iconFile = 'dm4reva.icns'
const identifier = 'byron1st'

gulp.task('clean', () => {
  return del.sync([
    'dist/**/**/*',
    'dist/*',
    'db/*'
  ])
})

gulp.task('compile:js', () => {
  return gulp.src(srcList)
    .pipe(babel({
      'presets': ['es2015', 'react']
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('copy:view', () => {
  return gulp.src([
    './src/app.config.json',
    './src/view/*.html',
    './src/view/css/*'
  ])
  .pipe(gulp.dest('./dist'))
})

gulp.task('default', ['clean', 'compile:js', 'copy:view'])
gulp.task('package', ['finalize:electron'])

gulp.task('clean:build', () => {
  return del.sync([
    'build/**/*'
  ])
})

gulp.task('pack:asar', ['pack:compile', 'pack:npm', 'pack:copy', 'pack:view'],() => {
  return gulp.src('*.js', {read: false})
  .pipe(shell([
    'asar pack ./build ./build/app.asar'
  ]))
})

gulp.task('pack:compile', ['clean:build'], () => {
  return gulp.src(srcList)
    .pipe(babel({
      'presets': ['es2015', 'react']
    }))
    .pipe(gulp.dest('./build/dist'))
})

gulp.task('pack:npm', ['clean:build'], () => {
  fs.writeFileSync('./build/package.json', JSON.stringify(minifiedPackageJson))
  return gulp.src('*.js', {read: false})
  .pipe(shell([
    'npm --prefix ./build install ./build'
  ]))
})

gulp.task('pack:copy', ['clean:build'], () => {
  return gulp.src([
    'LICENSE',
    'README.md'
  ])
  .pipe(gulp.dest('./build'))
})

gulp.task('pack:view', ['pack:compile'], () => {
  fs.writeFileSync('./build/dist/app.config.json', JSON.stringify({mode: 'production'}))
  return gulp.src([
    './src/view/*.html',
    './src/view/css/*'
  ])
  .pipe(gulp.dest('./build/dist'))
})

gulp.task('copy:electron', ['pack:asar'], () => {
  return gulp.src('*.js', {read:false})
  .pipe(shell([
    'mkdir ./build/electron',
    'cp -R ./node_modules/electron-prebuilt/dist/Electron.app/. ./build/electron/' + programAppName + '.app/'
  ]))
})

gulp.task('finalize:electron', ['copy:electron'], () => {
  let plistObj = plist.parse(fs.readFileSync('./build/electron/' + programAppName + '.app/Contents/Info.plist').toString())
  plistObj.CFBundleDisplayName = programName
  plistObj.CFBundleIdentifier = identifier
  plistObj.CFBundleName = programName
  plistObj.CFBundleShortVersionString = versionNumber
  plistObj.CFBundleVersion = versionNumber
  plistObj.CFBundleIconFile = iconFile
  fs.writeFileSync('./build/electron/' + programAppName + '.app/Contents/Info.plist', plist.build(plistObj))

  return gulp.src([
    './build/app.asar',
    './dm4reva.icns'
  ])
  .pipe(gulp.dest('./build/electron/' + programAppName + '.app/Contents/Resources'))
})
