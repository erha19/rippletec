var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'uglify-save-license', 'del', 'imagemin-pngquant']
    }),
    path = require('path'),
    fs = require('fs'),
    browserSyncSpa = require('browser-sync-spa'),
    browserSync = require('browser-sync'),
    proxyMiddleware = require('http-proxy-middleware'),
    reload = browserSync.reload;
SRC = '.',
    DIST = 'dist',
    PATH = {
        Cssfile: [SRC + '/vendor/*.css', SRC + '/style/*.css'],
        Jsfile: [SRC + '/vendor/*.js', SRC + '/js/*.js'],
        Copyfile: [SRC + '/images/**/*']
    }



function copy() {
    return gulp.src(PATH.Copyfile)
        .pipe(gulp.dest(DIST + '/images'));
}

function sync() {
    var files = [
        "./js/**/*.js",
        "./style/**/*.css",
        "./images/**/*.{jpg,png,gif}",
        "./**/*.html"
    ];
    browserSync.init(files, {
        startPath: './',
        port: 3000,
        open: false,
        server: {
            baseDir: './',

            //使用代理

            middleware: [
                proxyMiddleware(['/index.php'], {
                    target: 'http://localhost:8080/',
                    changeOrigin: true
                })
                // proxyMiddleware(['/index.php'], { target: 'http://www.rippletec.net/', changeOrigin: true})
            ]
        }
    });
    gulp.watch("./sass/compoent/*.scss", ['sass']);
    gulp.watch("./vendor/**/*.js", ['build-vendor'])
        // gulp.watch("./vendor.json", ['build-vendor']);
    gulp.watch(files).on('change', reload);
}

function buildVendorJs() {
    var filterJS = $.filter('**/*.js', {
        restore: true
    });
    return gulp.src('./bower.json')
        .pipe($.mainBowerFiles())
        .pipe(filterJS)
        .pipe(filterJS.restore)
        .pipe(gulp.dest('./vendor'))
        .pipe(reload({
            stream: true
        }));
}

function buildVendorCss() {
    var filterCSS = $.filter('**/*.css', {
        restore: true
    });
    return gulp.src('./bower.json')
        .pipe($.mainBowerFiles())
        .pipe(filterCSS)
        .pipe($.concat('vendor.css'))
        .pipe($.cssnano())
        .pipe(filterCSS.restore)
        .pipe(gulp.dest('./vendor'))
}

function buildVender() {
    var filterCSS = $.filter('**/*.css', {
            restore: true
        }),
        filterJS = $.filter('**/*.js', {
            restore: true
        });
    return gulp.src(['./vendor/**/*', '!vendor/vendor.js', '!vendor/vendor.css'])
        .pipe(filterJS)
        .pipe($.order(['/vendor/jquery/**/*.js', '/vendor/**/*.js']))
        .pipe($.concat('vendor.js'))
        .pipe($.uglify())
        .pipe(filterJS.restore)
        
        .pipe(filterCSS)
        .pipe($.concat('vendor.css'))
        .pipe($.cssnano())
        .pipe($.autoprefixer({
            browsers: ['last 20 versions'],
            cascade: false
        }))
        .pipe(filterCSS.restore)
        .pipe(gulp.dest('./vendor'))
        .pipe(reload({
            stream: true
        }));
}

gulp.task('sass', function() {
    return gulp.src('./sass/app.scss')
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer({
            browsers: ['last 20 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./style'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('clean', function() {
    $.del(DIST);
});

gulp.task('html', ['clean', 'sass'], function() {

    var htmlFilter = $.filter('*.html', {
        restore: true
    });
    var jsFilter = $.filter('**/*.js', {
        restore: true
    });
    var cssFilter = $.filter('**/*.css', {
        restore: true
    });

    return gulp.src(path.join(SRC, '/index.html'))

    //js处理
    .pipe($.useref())
        .pipe(jsFilter)
        .pipe($.stripDebug())
        .pipe($.uglify())
        .pipe(jsFilter.restore)
        //css处理
        .pipe(cssFilter)
        .pipe($.cssnano())
        .pipe(cssFilter.restore)
        //md5后缀
        .pipe($.if('*.css', $.rev()))
        .pipe($.if('*.js', $.rev()))
        //替换md5后缀的文件名
        .pipe($.revReplace())
        //html处理
        .pipe(htmlFilter)
        .pipe($.minifyHtml({
            empty: true,
            spare: true,
            quotes: true,
            conditionals: true
        }))
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest(DIST))
        .pipe($.size({
            title: path.join(DIST, '/'),
            showFiles: true
        }));

});

gulp.task('build-vendor', buildVender)

gulp.task('buildVendorCss', buildVendorCss)

gulp.task('buildVendorJs', buildVendorJs)

gulp.task('sync', ['sass'], sync);

gulp.task('copy', ['html'], copy)

gulp.task('build', ['copy']);