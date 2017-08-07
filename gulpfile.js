/**
 * https://www.viget.com/articles/gulp-browserify-starter-faq
 * https://csspod.com/using-browserify-with-gulp/
 */

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var minifycss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var watchify = require('watchify');
var uglify = require('gulp-uglify')
var streamify = require('streamify');
var watchPath = require('gulp-watch-path');
var babelify = require('babelify');

gulp.task('watchcss', function(){
    gulp.watch('src/css/**/*.css', function(event) {
        var paths = watchPath(event, 'src/', 'dist/');
        gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
        gutil.log('Dist ' + paths.distPath);
        gulp.src(paths.srcPath)
            .pipe(sourcemaps.init())
            .pipe(minifycss())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(paths.distDir))

    });
});
 
gulp.task('browserify', function() {
    return browserify('./src/js/index.js')
        .bundle()
        //Pass desired output filename to vinyl-source-stream
        .pipe(source('bundle.js'))
        // Start piping stream to tasks!
        .pipe(gulp.dest('./dist/'));
});

var customOpts = {
    entries: ['./src/js/index.js'],
    debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts).transform("babelify", { presets: ["es2015"] }));

gulp.task('js', bundle);
b.on('update', bundle); // 当任何依赖发生改变的时候，运行打包工具
b.on('log', gutil.log); // 输出编译日志到终端

function bundle(){
    return b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
        .pipe(sourcemaps.init())
        // .pipe(uglify()) // now gulp-uglify works 
        // 可选项，如果你不需要 sourcemaps，就删除
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist'));
}

gulp.task('default', ['js', 'watchcss']);