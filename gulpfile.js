var gulp = require('gulp'),
    $    = require('gulp-load-plugins')(),
    fs = require('fs'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;
    SRC=__dirname+'/src',
    DIST=__dirname+'/dist',
    PATH={
        Cssfile:[SRC+'/css/**/*.css'],
        Jsfile:[SRC+'/js/**/*.js'],
        Copyfile:[SRC+'/images/**/*'],
        HtmlFile:[]
    }

function css() {
    return gulp.src(PATH.Cssfile)
        .pipe($.concat('common.min.css'))
        .pipe($.changed(SRC))
        .pipe($.cssnano())
        .pipe(gulp.dest(DIST + '/styles'));
}

function js() {
    return gulp.src(PATH.Jsfile)
        .pipe(plumber())
        .pipe(stripDebug())
        .pipe($.changed(SRC))
        .pipe($.$.uglify())
        .pipe($.concat('app.js'))
        .pipe(gulp.dest(DIST+'/js'));
}


function md5() {
    var revall = new RevAll({
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
        .pipe($.changed(DIST))
        .pipe(gulp.dest(DIST+'/images'));
}

function html() {
    return gulp.src(PATH.HtmlFile)
        .pipe($.changed(DIST))
        .pipe($.htmlmin({
            removeComments: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(DIST));
}

function rel() {
    return gulp.src(DIST + '/index.html')
        .pipe($.changed(DIST + '/index.html'))
        .pipe(rev())
        .pipe(gulp.dest(DIST));
}

function sync() {
    var files=["./**/*"]
    browserSync.init(files, {
        proxy: "http://localhost:8080"
    });
    gulp.watch("./sass/**/*.scss", ['sass']);
    gulp.watch(files).on('change', reload);
}

gulp.task('build-vendor',function(){
    var filterJS = $.filter('**/*.js', { restore: true }),
        mainFiles=JSON.parse(fs.readFileSync('./vendor.json'));
        console.log(mainFiles)
    return gulp.src('./package.json')
        .pipe($.mainBowerFiles({
            overrides: mainFiles
        }))
        .pipe(filterJS)
        .pipe($.concat('vendor.js'))
        .pipe($.uglify())
        .pipe(filterJS.restore)
        .pipe(gulp.dest('./vendor'));
})

gulp.task('sass', function(){
    return gulp.src('./sass/app.scss')
        .pipe($.sass().on('error', $.sass.logError))
        // .pipe($.autoprefixer('last 2 version', 'ie 8', 'ie 9'))
        .pipe(gulp.dest('./style'))
        .pipe(reload({stream: true}));
});

gulp.task('sync',['sass'],sync);

gulp.task('js',js)

gulp.task('css',css)

gulp.task('copy',copy)

gulp.task('md5',md5)

gulp.task('rel',rel)

gulp.task('default', ['md5']);