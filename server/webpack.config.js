const path = require('path');
const FileManagerPlugin = require("filemanager-webpack-plugin");
const PACKAGE = require('./package.json');
const bundleName = `${PACKAGE.name}-${PACKAGE.version}`;

module.exports = {
    entry: './src/index.js',
    output: {
        filename: `${bundleName}.js`,
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new FileManagerPlugin({
            events: {
                onEnd: {
                    copy: [
                        {
                            source: path.join(__dirname, `dist/${bundleName}.js`),
                            destination: path.join(__dirname, `public/${bundleName}.js`)
                        }
                    ]
                }
            }
        })
    ]
    /*plugins: [
        new CopyPlugin({
            patterns: [
                { from: `dist/${bundleName}.js`, to: "../public" }
            ],
        }),
    ],*/
};