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
                    target: 'esnext' // https://esbuild.github.io/content-types/
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    }
};

const jsBuild = Object.assign({}, config, {
    name: 'GLightboxJS',
    entry: {
        'js/glightbox-umd.js': {
            //import: './src/js/glightbox.js',
            import: './src/js/index.js',
            library: {
                name: 'glightbox',
                type: 'umd',
                export: ['default'],
                umdNamedDefine: true
            }
        },
        'js/glightbox.js': {
            import: './src/js/index.js',
            library: {
                //name: 'GLightbox',
                export: ['default'],
                type: 'commonjs2'
            }
        }
    },
    output: {
        //iife: false,
        filename: '[name]',
        //globalObject: 'typeof self !== \'undefined\' ? self : this',
        globalObject: 'this',
        //library: 'GLightbox',
        //libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        //minimize: false,
        minimizer: [
            new TerserPlugin({
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

module.exports = [jsBuild, cssBuild];
