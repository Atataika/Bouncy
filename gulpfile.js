const gulp = require('gulp');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');

let out = {
    html: ["./out/"],
    css: ["./out/css"],
    img: ["./out/images"],
    fonts: ["./out/fonts"]
}

function build_html() {
    return gulp.src("./src/index.html")
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(out.html));
}

function build_scss() {
    return gulp.src('./src/scss/style.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(out.css));
}

function minify_img() {
    return gulp.src("./src/images/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest(out.img));
}

function fonts_parse() {
    return gulp.src("./src/fonts/*")
        .pipe(gulp.dest(out.fonts));
}

function dev_scss() {
    return gulp.src('./src/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .on('error', console.error.bind(console))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("./src/css"));
}

function watchScss() {
    gulp.watch("./src/scss/**/*.scss", dev_scss);
}

exports.default = watchScss;
exports.build = gulp.parallel(build_html, build_scss, fonts_parse, minify_img);