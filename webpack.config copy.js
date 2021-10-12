const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production';

const config = {
    watch: false,
    mode: process.env.NODE_ENV,
    devtool: false,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'esbuild-loader',
                options: {
                    target: 'es2015'
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    }
};

const jsBuildUMD = Object.assign({}, config, {
    name: 'GLightboxJS',
    entry: {
        'js/glightbox.js': './src/js/glightbox.js'
    },
    output: {
        filename: '[name]',
        library: 'GLightbox',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        //minimize: false,
        minimizer: [
            new TerserPlugin({
                //parallel: true,
                extractComments: false,
                terserOptions: {
                    compress: false,
                    sourceMap: false,
                    output: {
                        comments: false
                    }
                }
            })
        ]
    }
});


const cssBuild = Object.assign({}, config, {
    name: 'GLightboxCSS',
    entry: {
        glightbox: './src/css/glightbox.css'
    },
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: './css/[name].css'
        })
    ],
    optimization: {
        //minimize: true,
        minimizer: [
            '...',
            new CssMinimizerPlugin({
                parallel: true,
                minimizerOptions: {
                    preset: ['default', {
                        discardComments: { removeAll: true }
                    }]
                }
            })
        ]
    }
});

//module.exports = [jsBuild, cssBuild];
module.exports = [jsBuildUMD];
