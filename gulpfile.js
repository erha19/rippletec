var gulp = require('gulp'),
    $    = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'uglify-save-license', 'del','imagemin-pngquant']
    }),
    fs = require('fs'),
    browserSyncSpa = require('browser-sync-spa'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;
    SRC='.',
    DIST='../dist',
    PATH={
        Cssfile:[SRC+'/vendor/*.css',SRC+'/style/*.css'],
        Jsfile:[SRC+'/vendor/*.js',SRC+'/js/*.js'],
        Copyfile:[SRC+'/images/**/*']
    }

function css() {
    return gulp.src(PATH.Cssfile)
        .pipe($.concat('app.css'))
        .pipe($.changed(SRC))
        .pipe($.cssnano())
        .pipe(gulp.dest(DIST + '/style'));
}

function js() {
    return gulp.src(PATH.Jsfile)
        .pipe($.plumber())
        .pipe($.stripDebug())
        .pipe($.changed(SRC))
        .pipe($.uglify())
        .pipe($.concat('app.js'))
        .pipe(gulp.dest(DIST+'/js'));
}


function md5() {
    var revall = new $.revAll({
        dontRenameFile: [/^\/index\.html$/, /^\/favicon.ico$/g],
        transformFilename: function(file, hash) {
            return hash + file.path.slice(file.path.lastIndexOf('.'));
        }
    });
    return gulp.src([DIST + '/**'])
        .pipe(revall.revision())
        .pipe(gulp.dest(DIST))
        .pipe(revall.manifestFile())
        .pipe(gulp.dest(DIST));
}


function copy() {
    return gulp.src(PATH.Copyfile)
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [$.imageminPngquant()]
         }))
        .pipe($.changed(DIST))
        .pipe(gulp.dest(DIST+'/images'));
}

function html() {
    return gulp.src(DIST + '/index.html')
        .pipe($.htmlmin({
            removeComments: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(DIST));
}

function rel() {
    return gulp.src(DIST + '/index.html')
        .pipe($.changed(DIST + '/index.html'))
        .pipe($.revAppend())
        .pipe(gulp.dest(DIST));
}

function sync() {
    var files=[
        "./js/**/*.js",
        "./style/**/*.css",
        "./images/**/*.{jpg,png,gif}",
        "./**/*.html"
        ];
    browserSync.init(files,{
        proxy: "http://localhost:8080"
    });
    gulp.watch("./sass/compoent/*.scss", ['sass']);
    // gulp.watch("./vendor.json", ['build-vendor']);
    gulp.watch(files).on('change', reload);
}

function buildVendorJs(){
    var filterJS = $.filter('**/*.js', { restore: true });
    return gulp.src('./bower.json')
        .pipe($.mainBowerFiles())
        .pipe(filterJS)
        .pipe(filterJS.restore)
        .pipe(gulp.dest('./vendor'))
}
function buildVendorCss(){
    var filterCSS = $.filter('**/*.css', { restore: true });
    return gulp.src('./bower.json')
        .pipe($.mainBowerFiles())
        .pipe(filterCSS)
        .pipe($.concat('vendor.css'))
        .pipe($.cssnano())
        .pipe(filterCSS.restore)
        .pipe(gulp.dest('./vendor'))
}
function buildVender(){
    var filterCSS = $.filter('**/*.css', { restore: true }),
        filterJS = $.filter('**/*.js', { restore: true });
    return gulp.src(['./vendor/**/*','!vendor/vendor.js','!vendor/vendor.css'])
           .pipe(filterJS)
           .pipe($.order(['/vendor/jquery/**/*.js','/vendor/**/*.js']))
           .pipe($.concat('vendor.js'))
           .pipe($.uglify())
           .pipe(filterJS.restore)
           .pipe(filterCSS)
           .pipe($.concat('vendor.css'))
           .pipe($.cssnano())
           .pipe(filterCSS.restore)
           .pipe(gulp.dest('./vendor'))
           .pipe(reload({stream: true}));
}

gulp.task('sass', function(){
    return gulp.src('./sass/app.scss')
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.autoprefixer('last 20 version', 'ie 8', 'ie 9'))
        .pipe(gulp.dest('./style'))
        .pipe(reload({stream: true}));
});

gulp.task('build-vendor',['buildVendorCss','buildVendorJs'],buildVender)

gulp.task('buildVendorCss',buildVendorCss)

gulp.task('buildVendorJs',buildVendorJs)

gulp.task('sync',['sass'],sync);

gulp.task('html',['md5'],html)

gulp.task('js',js)

gulp.task('css',css)

gulp.task('copy',copy)

gulp.task('md5',['rel'],md5)

gulp.task('rel',['js','css','html'],rel)

gulp.task('build', ['html'],rel);