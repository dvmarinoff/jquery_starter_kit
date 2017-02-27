var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-ruby-sass');
var reload      = browserSync.reload;

var path = 'public/';
var env = 'front';

switch(env){
    case 'front':
        path = 'public/';
        break;
    case 'development':
        path = 'server/public_html/scripts/front/';
        break;
    default:
        path = 'public/';
        break;
}

gulp.task('sass', function() {
    return sass(path + 'css/') 
    .on('error', function (err) {
        console.error('Error!', err.message);
    })
    .pipe(gulp.dest(path + 'css/'));
});

gulp.task('serve', function() {

    browserSync.init({
        server: path
    });

    // gulp.watch([path + "css/*.scss", path + "*.html", path + "js/*.js"], ['sass']).on('change', browserSync.reload);
    gulp.watch([path + "css/*.scss", path + "*.html", path + "js/*.js"]).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);