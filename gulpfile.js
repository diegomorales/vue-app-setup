const gulp = require('gulp')

// Tasks
const paths = require('./tasks/paths')
const reload = require('./tasks/reload')
const cleanBuild = require('./tasks/clean-build')
const copyAssets = require('./tasks/copy-assets')
const startServer = require('./tasks/start-server')
const buildJs = require('./tasks/build-js')
const buildModernizr = require('./tasks/build-modernizr')

// Set default environment
process.env.PRERENDER = 'false'
process.env.NODE_ENV = 'production'

// Some files can't be hot-reloaded.
// List them here
const filesToReload = [
  paths.dev + 'index.html',
  paths.devJs + 'app.js',
  paths.devViews + 'app.vue'
]

const build = gulp.series(cleanBuild, gulp.parallel(
  copyAssets,
  buildModernizr,
  buildJs
))

const watch = gulp.series(build, function watch () {
  startServer()

  gulp.watch([paths.devAssets + '**/*.*'], gulp.series(copyAssets, reload))
  gulp.watch(filesToReload, reload)
})

gulp.task('default', gulp.series((done) => {
  // Set environment
  process.env.NODE_ENV = 'development'
  done()
}, watch))

gulp.task('build', build)

gulp.task('prerender', gulp.series((done) => {
  // Set environment
  process.env.PRERENDER = 'true'

  done()
}, build))
