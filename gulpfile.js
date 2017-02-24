var gulp        = require('gulp');
var browserSync = require('browser-sync');
var concat      = require('gulp-concat');
var imagemin    = require('gulp-imagemin');
var pngquant    = require('imagemin-pngquant');
var uglify      = require('gulp-uglify');
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

// gulp.task('vendor_concat', function() {
//     return gulp.src([path + '/lib/jquery/dist/jquery.min.js', path + '/lib/velocity.min.js', path + '/lib/slick.js/slick/slick.min.js'])
//         .pipe(concat('vendor.js'))
//         .pipe(gulp.dest(path + './dist/js/'));
// });

// gulp.task('app_concat', function() {

//     return gulp.src(path + 'js/*.js')
//         .pipe(concat('app' + '.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest(path + './dist/js/'));
// });

// gulp.task('css_concat', function() {
//     return gulp.src([path + 'css/*.css'])
//         .pipe(concat('app.css'))
//         .pipe(gulp.dest(path + './dist/css/'));
// });

// gulp.task('image_min', function () {
//     return gulp.src(path + '/images/*')
//         .pipe(imagemin({
//             progressive: true,
//             svgoPlugins: [{removeViewBox: false}],
//             use: [pngquant()]
//         }))
//         .pipe(gulp.dest('dist/images'));
// });

// gulp.task('build', ['vendor_concat', 'app_concat', 'css_concat', 'image_min'], function () {
//      console.log('\nBuild finished!\n');
// });

gulp.task('serve', function() {

    browserSync.init({
        server: path
    });

    // gulp.watch([path + "css/*.scss", path + "*.html", path + "js/*.js"], ['sass']).on('change', browserSync.reload);
    gulp.watch([path + "css/*.scss", path + "*.html", path + "js/*.js"]).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);