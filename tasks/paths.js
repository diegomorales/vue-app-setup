module.exports = {
  dev: './app/',
  get devScss () {
    return this.dev + 'scss/'
  },
  get devJs () {
    return this.dev + 'js/'
  },
  get devAssets () {
    return this.dev + 'assets/'
  },
  get devViews () {
    return this.dev + 'views/'
  },
  build: './build/',
  get buildCss () {
    return this.build + 'css/'
  },
  get buildJs () {
    return this.build + 'js/'
  },
  get buildAssets () {
    return this.build + 'assets/'
  }
}
