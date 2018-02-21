let del = require('del'),
    gulp = require('gulp'),
    browser = require('browser-sync'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config'),
    modernizr = require('gulp-modernizr'),
    uglify = require('gulp-uglify'),
    webpackDevMiddleware = require('webpack-dev-middleware'),
    webpackHotMiddleware = require('webpack-hot-middleware'),
    history = require('connect-history-api-fallback'),
    isProd = false,
    compiler;

// Set default environment
process.env.NODE_ENV = 'development';

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

    if (isProd) {
        compiler.run((err, stats) => {
            if (err) {
                console.error(err.stack || err);
                if (err.details) {
                    console.error(err.details);
                }
                return;
            }

            const info = stats.toJson();

            if (stats.hasErrors()) {
                console.error(info.errors);
            }

            if (stats.hasWarnings()) {
                console.warn(info.warnings)
            }

            // Log result...
            console.log(stats.toString({
                chunks: false,  // Makes the build much quieter
                modules: false,
                colors: true,    // Shows colors in the console
                moduleTrace: false
            }));
        });
    }

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

    gulp.watch([paths.devAssets + '**/*.*'], gulp.series(copyAssets, reload));
    gulp.watch(filesToReload, reload);
});

gulp.task('default', watch);
gulp.task('build', gulp.series((done) => {
    isProd = true;

    // Set environment
    process.env.NODE_ENV = 'production';

    done();
}, build));
