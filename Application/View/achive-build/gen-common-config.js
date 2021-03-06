const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const nodeModulesPath = path.join(__dirname, 'node_modules');
const vendorConfig = require('./config-vendor');
const _ = require('lodash');

module.exports = function genCommonConfig(viewFolderName){
    const viewPath = path.join(__dirname, '..', viewFolderName);
    console.log(viewPath)
    return {
        output: {
            filename: 'js/[name].js?[chunkhash:8]'
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    minimize: true
                                }
                            }
                        ],
                        fallback: 'style-loader'
                    })
                },
                {
                    test: /\.(png|jpe?g|gif)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1000,
                                name: 'img/[name].[ext]?[hash:8]'
                            }
                        }
                    ]
                },
                {
                    test: /\.(otf|eot|ttf|svg|woff2?)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 1000,
                                name: 'fonts/[name].[ext]?[hash:8]'
                            }
                        }
                    ]
                }
            ]
        },
        externals: {
            jquery: '$',
            lodash: '_',
            vue: 'Vue',
            vueRouter: 'VueRouter'
        },
        resolve: {
            modules: [viewPath, nodeModulesPath],
            alias: _.assign({
                WebCommon: path.join(viewPath, 'web/common'),
                WebComponent: path.join(viewPath, 'web/component'),
                WebmCommon: path.join(viewPath, 'webm/common'),
                AdminCommon: path.join(viewPath, 'admin/common'),
                webm: path.join(viewPath, 'webm'),
                web: path.join(viewPath, 'web'),
                admin: path.join(viewPath, 'admin')
            }, _.mapValues(vendorConfig, v => 'vendor/'+v))
        },
        resolveLoader: {
            modules: [nodeModulesPath],
            alias: {
                text: 'text-loader',
                css: 'style-loader'
            }
        },
        stats: {
            // excludeModules: [],
            // maxModules: Infinity,
            colors: true,
            chunkModules: false,
            modules: false
        },
        devtool: 'source-map',
        plugins: [
            new ExtractTextPlugin('css/[name].css?[contenthash:8]'),
            // new webpack.optimize.UglifyJsPlugin({
            //     sourceMap: true,
            //     compress: {
            //         warnings: false
            //     }
            // })
        ]
    };
};