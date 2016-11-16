var gulp = require('gulp');

require('@recipher/gulp')(gulp, { test: { coverage: 20 }});

gulp.task('default', [ 'test' ]);
