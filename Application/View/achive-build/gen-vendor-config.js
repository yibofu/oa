const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const nodeModulesPath = path.join(__dirname, 'node_modules');

module.exports = function genVendorConfig(viewFolderName){
    const viewPath = path.join(__dirname, '..', viewFolderName);
    const vendorPath = path.join(viewPath, 'vendor');
    return {
        context: vendorPath,
        entry: {
            vendor1: 'main1.js',
            vendor2: 'main2.js'
        },
        output: {
            path: vendorPath,
            filename: '[name].js?[chunkhash:8]',
            publicPath: '/Application/View/View/vendor/'
        },
        resolve: {
            modules: [vendorPath, nodeModulesPath],
            alias: {
                jquery: 'jquery/jquery.js',
                vue: 'vue/vue.js',
                lodash: 'lodash/lodash.min.js',
                vueRouter: 'vue-router/vue-router.js'
            }
        },
        stats: {
            colors: true,
            chunkModules: false,
            modules: false
        },
        devtool: 'source-map',
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
                compress: {
                    warnings: false
                }
            }),
            new HtmlWebpackPlugin({
                filename: 'vendor.html',
                template: 'vendor.tpl.html'
            })
        ]
    };
};