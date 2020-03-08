const path = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',

    entry: './src/index.js',

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js'
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: miniCssExtractPlugin.loader,
                    },
                    'css-loader',
                    'postcss-loader'
                ],
            }
        ]
      },

    plugins: [
        new CleanWebpackPlugin(),
        new miniCssExtractPlugin({
            filename: "styles.css",
            chunkFilename: '[id].css',
            ignoreOrder: false
        }),
    ]
};