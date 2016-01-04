var gulp = require('gulp');

require('@ftbl/gulp')(gulp, { test: { coverage: 40 }});

gulp.task('default', [ 'test' ]);
