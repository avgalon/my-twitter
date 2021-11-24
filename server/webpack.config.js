const path = require('path');
const FileManagerPlugin = require("filemanager-webpack-plugin");
const PACKAGE = require('./package.json');
const bundleName = `${PACKAGE.name}-${PACKAGE.version}`;

module.exports = {
    entry: path.resolve(__dirname, './src/index.js'),
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js']
    },
    output: {
        filename: `${bundleName}.js`,
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    plugins: [
        new FileManagerPlugin({
            events: {
                onEnd: {
                    copy: [
                        {
                            source: '../build',
                            destination: path.join(__dirname, `public`)
                        }
                    ]
                }
            }
        })
    ]
};