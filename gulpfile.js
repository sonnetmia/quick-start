"use strict";
const { src, dest, gulp, series, parallel } = require('gulp');
const watch = require('gulp-watch');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const purgecss = require('gulp-purgecss');
const browsersync = require("browser-sync").create();

// const watch = gulp.parallel(watchFiles, browserSync);

function html() {
    return src('src/**/*.html')
        .pipe(dest('dist/'))
    //.pipe(browsersync.stream());
}

function assets() {
    return src('src/assets/**')
        .pipe(dest('dist/assets/'))
    // .pipe(browsersync.stream());
}

function css() {
    return src('src/css/*.css')
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(dest('dist/css'))
    // .pipe(browsersync.stream());
}

function sassify_me() {
    return src('src/scss/*.scss')
        .pipe(sass())
        .pipe(purgecss({
            content: ["src/**/*.html"]
        }))
        .pipe(dest('src/css'))
}

function js() {
    return src('src/js/*.js', { sourcemaps: true })
        .pipe(concat('app.min.js'))
        .pipe(dest('dist/js', { sourcemaps: true }))
    //.pipe(browsersync.stream());
}

// BrowserSync
function browserSync() {
    browsersync.init({
        server: {
            baseDir: "src/"
        },
        port: 3003
    });
}

// BrowserSync Reload
function browserSyncReload() {
    browsersync.reload();
}

// Gulp watch 
function watchChange() {
    browserSync();
    watch('src/scss/*.scss', series(sassify_me));
    watch('src/js/*.js', series(js, browserSyncReload));
    watch('src/css/*.css', series(css, browserSyncReload));
    watch('src/**/*.html', series(html, sassify_me, browserSyncReload));
    watch('src/assets/**', series(assets, sassify_me, browserSyncReload));
}

browserSyncReload
exports.browserSync = browserSync;
exports.browserSyncReload = browserSyncReload;
exports.watchChange = watchChange;
exports.assets = assets;
exports.js = js;
exports.css = css;
exports.sassify_me = sassify_me;
exports.html = html;
exports.default = parallel(html, assets, css, sassify_me, js, watchChange);