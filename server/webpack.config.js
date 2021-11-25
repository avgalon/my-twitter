const path = require('path');
const FileManagerPlugin = require("filemanager-webpack-plugin");

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
        filename: `index.js`,
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    target: 'node',
    plugins: [
        new FileManagerPlugin({
            events: {
                onEnd: {
                    copy: [
                        {
                            source: '../build',
                            destination: path.join(__dirname, `dist/public`)
                        }
                    ]
                }
            }
        })
    ]
};