const fs = require('fs'); // Read a file
const gulp =  require('gulp');
const del = require('del');
const zip = require('gulp-zip');
const replace = require('gulp-replace');
const argv = require('yargs').argv



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
    '!index.js',
    '!.gitignore',
    '!gulpfile.js',
    '!environment-config.json',
    '!package.json',
    '!package-lock.json',
    '!README.md'
  ])
    .pipe(gulp.dest("dist/"))
})

// Now the dist directory is ready to go. Zip it.
gulp.task('zip', () => {
  return gulp.src([
    'dist/**/*',
    'dist/.*'
    ])
  .pipe(zip('archive.zip'))
  .pipe(gulp.dest('./'))
});


// Gulp task
gulp.task('default', gulp.series([
  'clean',
  'update-env-var',
  'move',
  'zip'
  ])
)



