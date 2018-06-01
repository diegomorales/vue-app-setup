const path = require('path')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const PrerenderSpaPlugin = require('prerender-spa-plugin')

module.exports = (paths) => {
  const isProd = process.env.NODE_ENV === 'production'
  const doPrerender = process.env.PRERENDER === 'true'

  let entry = [paths.devJs + 'app.js']

  let plugins = [
    new HtmlWebpackPlugin({
      template: paths.dev + 'index.html',
      filename: path.resolve(__dirname, paths.build + 'index.html')
    }),
    new StylelintPlugin({
      emitErrors: false,
      files: [paths.devViews + '**/*.vue', paths.devScss + '**/*.scss']
    })
  ]

  let postCssPlugins = [
    autoprefixer({browsers: ['last 2 versions']})
  ]

  if (isProd) {
    plugins.push(new ExtractTextPlugin('css/app.css'))
    plugins.push(new UglifyJsPlugin({
      sourceMap: true
    }))
    postCssPlugins.push(cssnano())
  } else {
    entry = ['webpack-hot-middleware/client?overlay=false'].concat(entry)
    plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  if (doPrerender) {
    plugins.push(new PrerenderSpaPlugin(
      path.resolve(__dirname, paths.build),

      // These are example paths.
      ['/', '/example']
    ))
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
            emitWarning: true,
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
          test: /\.scss$/,
          use: isProd ? ExtractTextPlugin.extract({
            use: [
              {
                loader: 'css-loader'
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: postCssPlugins
                }
              },
              {
                loader: 'sass-loader'
              }
            ]
            })
            : [
              {
                loader: 'style-loader'
              },
              {
                loader: 'css-loader'
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: postCssPlugins
                }
              },
              {
                loader: 'sass-loader'
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
                postcss: postCssPlugins
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
}
