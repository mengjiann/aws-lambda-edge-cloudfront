const fs = require('fs'); // Read a file
const gulp =  require('gulp');
const del = require('del');
const zip = require('gulp-zip');
const replace = require('gulp-replace');
const argv = require('yargs').argv
const install = require("gulp-install");

// Clean the dist folder
gulp.task('clean', () => {
  return del([
    './dist/**',
    './archive.zip'
    ]);
});

// Update env variables and move to dist folder.
gulp.task('update-env-var', () => {

  var settings = JSON.parse(fs.readFileSync('./environment-config.json', 'utf8'));
  var env = argv.env;
  var botUserAgent = settings.botUserAgent[env] ? settings.botUserAgent[env] : settings.botUserAgent['default'];
  var externalApi = settings.externalApi[env] ? settings.externalApi[env] : settings.externalApi['default'];

  return gulp.src(['index.js'])
    .pipe(replace('process.env.BOT_USER_AGENT', botUserAgent))
    .pipe(replace('process.env.EXTERNAL_API', externalApi))
    .pipe(gulp.dest('dist/'))
})

// Move the files to the dist folder.
gulp.task('move', () => {
  return gulp.src([
    '**',
    '!dist/**',
    '!node_modules/**',
    '!index.js',
    '!.gitignore',
    '!gulpfile.js',
    '!package.json',
    '!package-lock.json',
    '!environment-config.json',
    '!README.md'
  ])
    .pipe(gulp.dest("dist/"))
})

// Install for production
gulp.task('install-for-prod', () => {
  return gulp.src(['./package.json','./package-lock.json'])
  .pipe(gulp.dest('./dist/'))
  .pipe(install({production: true}))
});

// Clean package.json
gulp.task('clean-package-json', () => {
  return del([
    './dist/package*'
    ]);
});

// Now the dist directory is ready to go. Zip it.
gulp.task('zip', () => {
  return gulp.src([
    'dist/**/*',
    'dist/.*'
    ])
  .pipe(zip('archive.zip'))
  .pipe(gulp.dest('./'))
});


// Gulp task for local dev.
gulp.task('default', gulp.series([
  'clean',
  'update-env-var',
  'move',
  'install-for-prod',
  'clean-package-json',
  'zip'
  ])
)

// Gulp task for aws codebuild task.
gulp.task('aws-codebuild', gulp.series([
  'clean',
  'update-env-var',
  'move',
  'install-for-prod',
  'clean-package-json',
  ])
)

