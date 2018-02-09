let path = require('path'),
    del = require('del'),
    gulp = require('gulp'),
    browser = require('browser-sync'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config'),
    yargs = require('yargs');

// Set environment
process.env.NODE_ENV = !!(yargs.argv.production) ? 'production' : 'development';

const isProd = process.env.NODE_ENV === 'production';

const paths = {
    dev: './app/',
    get devPages() {
        return this.dev + 'pages/';
    },
    get devScss() {
        return this.dev + 'scss/';
    },
    get devJs() {
        return this.dev + 'js/';
    },
    get devAssets() {
        return this.dev + 'assets/';
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

const reload = (done) => {
    browser.reload();
    done();
};

const startServer = () => browser.init({
    server: {
        baseDir: './build',
        port: 3000
    },
    open: false
});

let bundler;

const cleanBuild = () => del(paths.build);

const buildJs = (done) => {
    console.log(webpackConfig(paths));
    // bundler = webpack(webpackConfig(paths));
    webpack({
        devtool: 'source-map',
        entry: {
            main: paths.devJs + 'main.js',
        },
        output: {
            filename: 'main.js',
            path: path.resolve(__dirname, paths.buildJs)
        }

    }, (err, stats) => {
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

        // browser.reload();
        done();
    });
    done();
};

const copyAssets = () => {
    return gulp.src(paths.devAssets + '**/*.*')
        .pipe(gulp.dest(paths.buildAssets));
};

const build = gulp.series(cleanBuild, gulp.parallel(
    copyAssets,
    buildJs
));

const watch = gulp.series(build, () => {
    startServer();
});

gulp.task('default', watch);
