let del = require('del'),
    gulp = require('gulp'),
    browser = require('browser-sync'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config'),
    modernizr = require('gulp-modernizr'),
    uglify = require('gulp-uglify'),
    yargs = require('yargs'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    history = require('connect-history-api-fallback'),
    compiler;

// Set environment
process.env.NODE_ENV = !!(yargs.argv.production) ? 'production' : 'development';

const isProd = process.env.NODE_ENV === 'production';

const paths = {
    dev: './app/',
    get devScss() {
        return this.dev + 'scss/';
    },
    get devJs() {
        return this.dev + 'js/';
    },
    get devAssets() {
        return this.dev + 'assets/';
    },
    get devViews() {
        return this.dev + 'views/';
    },
    build: './build/',
    get buildCss() {
        return this.build + 'css/';
    },
    get buildJs() {
        return this.build + 'js/';
    },
    get buildAssets() {
        return this.build + 'assets/';
    }
};

// Some files can't be hot releoaded.
// List them here
const filesToReload = [
    paths.dev + 'index.html',
    paths.devJs + 'app.js',
    paths.devViews + 'app.vue'
];

const reload = (done) => {
    browser.reload();
    done();
};

const startServer = () => {
    browser.init({
        server: {
            baseDir: paths.build,
            middleware: [
                history(),
                webpackDevMiddleware(compiler, {
                    publicPath: webpackConfig(paths).output.publicPath,
                    stats: {
                        colors: true,
                        chunks: false,
                        modules: false,
                        modulesTrace: false
                    }
                }),
                webpackHotMiddleware(compiler, {
                    quiet: true
                })
            ],
            port: 3000
        },
        open: false
    });
};

const cleanBuild = () => del(paths.build);

const buildJs = (done) => {
    compiler = webpack(webpackConfig(paths));

    done();
};

const buildModernizr = () => {
    return gulp.src([paths.devJs + '**/*.js', paths.devScss + '**/*.scss'])
        .pipe(modernizr('modernizr-custom.js', {
            options: [
                'setClasses',
                'addTest',
                'html5printshiv',
                'testProp',
                'fnBind'
            ],
            excludeTests: ['hidden']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.buildJs))
};

const copyAssets = () => {
    return gulp.src(paths.devAssets + '**/*.*')
        .pipe(gulp.dest(paths.buildAssets));
};

const build = gulp.series(cleanBuild, gulp.parallel(
    copyAssets,
    buildModernizr,
    buildJs
));

const watch = gulp.series(build, () => {
    startServer();

    gulp.watch(filesToReload, reload);
});

gulp.task('default', watch);
