let path = require('path'),
    autoprefixer = require('autoprefixer'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = (paths) => {
    return {
        devtool: 'source-map',
        entry: ['webpack/hot/dev-server',
            'webpack-hot-middleware/client',
            paths.devJs + 'app.js'],
        output: {
            filename: 'app.js',
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
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new HtmlWebpackPlugin({
                template: paths.dev + 'index.html',
                filename: path.resolve(__dirname, paths.build + 'index.html')
            }),
            new StylelintPlugin({
                files: [paths.devViews + '**/*.vue', paths.devScss + '**/*.scss']
            })
        ],
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.min.js'
            }
        },
    }
};
