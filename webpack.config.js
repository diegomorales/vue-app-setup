let path = require('path'),
    autoprefixer = require('autoprefixer'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = (paths, isWatching) => {
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

    if (isWatching) {
        entry = ['webpack/hot/dev-server', 'webpack-hot-middleware/client'].concat(entry);

        plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return {
        devtool: isWatching ? 'eval-source-map' : 'source-map',
        entry: entry,
        output: {
            filename: 'js/app.js',
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
                                cssModules: {
                                    localIdentName: '[name]__[local]--[hash:base64]'
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
