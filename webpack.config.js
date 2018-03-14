let path = require('path'),
    autoprefixer = require('autoprefixer'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    StylelintPlugin = require('stylelint-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
    PrerenderSpaPlugin = require('prerender-spa-plugin');

module.exports = (paths, doPrerender) => {
    let isProd = process.env.NODE_ENV === 'production',
        entry = [paths.devJs + 'app.js'],
        plugins = [
            new HtmlWebpackPlugin({
                template: paths.dev + 'index.html',
                filename: path.resolve(__dirname, paths.build + 'index.html')
            }),
            new StylelintPlugin({
                files: [paths.devViews + '**/*.vue', paths.devScss + '**/*.scss']
            })
        ];

    if (!isProd) {
        entry = ['webpack-hot-middleware/client'].concat(entry);

        plugins.push(new webpack.HotModuleReplacementPlugin());
    } else {
        plugins.push(new ExtractTextPlugin('css/app.css'));
        plugins.push(new UglifyJsPlugin({
            sourceMap: true
        }));
    }

    if (doPrerender) {
        plugins.push(new PrerenderSpaPlugin(
            path.resolve(__dirname, paths.build),
            ['/', '/example']
        ));
    }

    return {
        devtool: isProd ? 'source-map' : 'eval-source-map',
        entry: entry,
        output: {
            filename: 'js/app.js',
            publicPath: '/',
            path: path.resolve(__dirname, paths.build)
        },
        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.vue$/,
                    exclude: /node_modules/,
                    loader: 'eslint-loader',
                    options: {
                        rules: {
                            'indent': 'off'
                        }
                    }
                },
                {
                    enforce: 'pre',
                    test: /\.js/,
                    exclude: /node_modules/,
                    loader: 'eslint-loader'
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['env']
                            }
                        }
                    ]
                },
                {
                    test: /\.vue$/,
                    use: [
                        {
                            loader: 'vue-loader',
                            options: {
                                extractCSS: isProd,
                                cssModules: {
                                    localIdentName: isProd ? '[hash:base64]' : '[name]__[local]--[hash:base64]'
                                },
                                postcss: [
                                    autoprefixer({browsers: ['last 2 versions']})
                                ]
                            }
                        }
                    ]
                }
            ]
        },
        plugins: plugins,
        resolve: {
            alias: {
                'vue$': isProd ? 'vue/dist/vue.min.js' : 'vue/dist/vue.esm.js'
            }
        },
    }
};
