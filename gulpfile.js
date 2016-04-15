var gulp = require('gulp');

require('@ftbl/gulp')(gulp, { test: { coverage: 35 }});

gulp.task('default', [ 'test' ]);
