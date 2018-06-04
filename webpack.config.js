const path = require('path')
const paths = require('./tasks/paths')
const autoprefixer = require('autoprefixer')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const StylelintPlugin = require('stylelint-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const PrerenderSpaPlugin = require('prerender-spa-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = () => {
  const isProd = process.env.NODE_ENV === 'production'
  const doPrerender = process.env.PRERENDER === 'true'

  let entry = [paths.devJs + 'app.js']

  let plugins = [
    new HtmlWebpackPlugin({
      minify: isProd,
      template: paths.dev + 'index.html',
      filename: path.resolve(__dirname, paths.build + 'index.html')
    }),
    new StylelintPlugin({
      emitErrors: false,
      files: [paths.devViews + '**/*.vue', paths.devScss + '**/*.scss']
    }),
    new VueLoaderPlugin(),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {discardComments: {removeAll: true}}
    })
  ]

  let styleLoaders = [
    'vue-style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: true,
        localIdentName: isProd ? '[hash:base64]' : '[name]__[local]--[hash:base64]'
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: [
          autoprefixer({browsers: ['last 2 versions']})
        ]
      }
    },
    {
      loader: 'sass-loader'
    }
  ]

  if (isProd) {
    plugins.push(new MiniCssExtractPlugin({
      filename: '[contenthash].css'
    }))
    plugins.push(new UglifyJsPlugin({
      uglifyOptions: {
        output: {
          comments: false
        }
      },
      sourceMap: true
    }))
    styleLoaders[0] = {
      loader: MiniCssExtractPlugin.loader
    }
  } else {
    entry = ['webpack-hot-middleware/client?overlay=false'].concat(entry)
    plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  if (doPrerender) {
    plugins.push(new PrerenderSpaPlugin(
      path.resolve(__dirname, paths.build),

      // Set the paths you want prerendered here.
      ['/', '/example']
    ))
  }

  return {
    mode: process.env.NODE_ENV,
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
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader'
            }
          ]
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
          use: styleLoaders
        }
      ]
    },
    plugins: plugins,
    resolve: {
      alias: {
        'vue$': isProd ? 'vue/dist/vue.min.js' : 'vue/dist/vue.esm.js'
      }
    }
  }
}
