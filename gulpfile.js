const gulp = require('gulp')
const browserify = require('browserify')
const source = require('vinyl-source-stream')

gulp.task('default', () => {
  return browserify({
    entries: './src/js/index.js'
  })
  .bundle()
  .pipe(source('visualizer.js'))
  .pipe(gulp.dest('./static/js'))
})
