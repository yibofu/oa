const {join} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const fs = require('fs');
const _ = require('lodash');
const genCommonConfig = require('./gen-common-config');
const buildWebpack = require('./build-webpack');

module.exports = class BuildModule{
    constructor({pages, module}){
        this.modulePath = module;
        this.pages = _.chain(pages)
            .compact()
            .uniq()
            .value();
        this.viewName = module.split('/')[0];
    }
    isModulePath(path){
        return path === this.modulePath;
    }
    isPagePath(path){
        for (let p of this.pages){
            if (path === this.modulePath+'/'+p){
                return true;
            }
        }
        return false;
    }
    belongTo(path){
        return this.modulePath.startsWith(path)
            && this.modulePath.split('/').slice(0, path.split('/').length).join('/') === path;
    }
    isInModule(path){
        return path.startsWith(this.modulePath);
    }
    buildPage(path){
        const pageName = path.replace(this.modulePath+'/', '');
        const config = this.getPageWebpackConfig(pageName);
        return this.webpackBuild([config]);
    }
    buildModule(){
        const configArr = this.pages.map(pageName => this.getPageWebpackConfig(pageName));
        return this.webpackBuild(configArr);
    }
    build(path){
        if (!this.isInModule(path)) return Promise.resolve();
        if (this.isModulePath(path)){
            return this.buildModule();
        }else if (this.isPagePath(path)){
            return this.buildPage(path);
        }
        return Promise.resolve();
    }
    webpackBuild(configArr){
        const config = merge(this.genCommonWebpackConfig(), this.genBaseWebpackConfig(), ...configArr);
        return buildWebpack(config, this.modulePath);
    }
    getPageWebpackConfig(pageName){
        const entries = [`${pageName}/${pageName}.js`, `${pageName}/main.js`];
        const entry = entries.find(p => fs.existsSync(this.getFullPath(p)));
        if (!entry){
            console.error(`Module [${this.modulePath}] Page [${pageName}], Entry not exist!`);
            return {};
        }
        return {
            entry: {
                [pageName]: entry
            },
            plugins: [
                new HtmlWebpackPlugin({
                    filename: `${pageName}.html`,
                    template: `${pageName}/${pageName}.tpl.html`,
                    chunks: [pageName]
                })
            ]
        };
    }
    genBaseWebpackConfig(){
        const contextPath = this.getFullPath();
        const distPath = this.getFullPath('dist');
        const publicPath = '/Application/View/'+this.modulePath+'/dist/';

        console.log("distPath:"+distPath);
        console.log("contextPath: "+contextPath);
        console.log("publicPath: "+publicPath);

        return {
            context: contextPath,
            output: {
                path: distPath,
                publicPath
            },
            resolve: {
                modules: [contextPath]
            }
        };
    }
    genCommonWebpackConfig(){
        return genCommonConfig(this.viewName);
    }
    getFullPath(subPath){
        const basePath = join(__dirname, '..', this.modulePath);
        return subPath ? join(basePath, subPath) : basePath;
    }
};