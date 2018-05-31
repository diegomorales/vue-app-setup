const paths = require('./paths');
const vars = require('./vars');
const browser = require('browser-sync');
const webpackConfig = require('../webpack.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const history = require('connect-history-api-fallback');

module.exports = function startServer() {
  browser.init({
    server: {
      baseDir: paths.build,
      middleware: [
        history(),
        webpackDevMiddleware(vars.compiler, {
          publicPath: webpackConfig(paths).output.publicPath,
          logLevel: 'info',
          stats: {
            colors: true,
            chunks: false,
            modules: false,
            moduleTrace: false
          }
        }),
        webpackHotMiddleware(vars.compiler)
      ],
      port: 3000
    },
    open: false
  });
};
