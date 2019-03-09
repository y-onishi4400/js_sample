var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var fs = require('fs');
var plumber = require('gulp-plumber');
var ejs = require('gulp-ejs');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var notify  = require('gulp-notify');
var watch = require('gulp-watch');
var cache = require('gulp-cached');
var sassGlob = require('gulp-sass-glob');
var pleeease = require('gulp-pleeease');
var destDir = 'html/css'; // 出力用ディレクトリ
var hugoDir = 'html/theme/static/css'; // 出力用ディレクトリ
var srcSass = 'resource/sass/**/*.scss';

var cleanCSS = require('gulp-clean-css');

gulp.task('ejs',function(){
  var json_path = 'src/data/json/data.json';
  var json = JSON.parse(fs.readFileSync(json_path,'utf8'));

  return gulp.src(["src/ejs/**/*.ejs", '!' + "src/ejs/**/_*.ejs"])
    .pipe(ejs(
      { json: json },
      {},
      { ext: '.html' }
    ))
    .pipe(gulp.dest('public/'));
});

/*
 sass
 */
 gulp.task('sass', function() {
  return gulp.src('./src/sass/**/**/*.scss')
  .pipe(sassGlob())
  .pipe(plumber({ // OK
    errorHandler: function (error) {
      console.log(error.message);
      this.emit('end');
    }}))
  .pipe(sass())
  .pipe(pleeease({
    sass: true,
    autoprefixer:true,
    minifier: false,
    mqpacker: false
  }))
  .pipe(gulp.dest( './public/css/'));
});


gulp.task('copy', function() {
  return gulp.src('./src/images/**/*')
  .pipe(gulp.dest('public/images'));
});


gulp.task('default', gulp.series( gulp.parallel('ejs', 'sass', 'copy'), function(){
  gulp.watch('src/ejs/**/*.ejs', gulp.task('ejs'));
  gulp.watch('src/sass/**/**/**/*.scss', gulp.task('sass'));
}));
