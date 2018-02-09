let path = require('path');

module.exports = (paths) => {

    return {
        devtool: 'source-map',
        entry: paths.devJs + 'main.js',
        output: {
            filename: `main.js`,
            path: path.resolve(__dirname, 'build')
        },
    }
};
