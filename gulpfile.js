var gulp = require('gulp');

require('@ftbl/gulp')(gulp, { test: { coverage: 20 }});

gulp.task('default', [ 'test' ]);
