var path = require('path');
var webpack = require('webpack');
var helper=require('path');
module.exports = {
    mode: 'development',
    entry: {
        addnewtutorial: './tutorials2/AddNewTutorial.ts',
        datastores:'./formBuilder/dataStores/SmartFormsDataStoreBootstrap.ts',
        conditionalHandlers: './conditional_manager/handlers/HandlerBootstrap.ts',
        conditionalManager: './conditional_manager/ConditionalManagerBootstrap.ts'
    },
    output: {
        path:path.join(__dirname+'/bundle'),
        filename: '[name]_bundle.js'
    },
    resolve: {
        modules: [
            path.resolve('../../node_modules')
        ],
        extensions: ['.ts', '.js','.tsx']
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            },
            {
                test: /\.jsx$/,
                use: ["source-map-loader"],
                enforce: "pre"
            },
            {
                test: /\.ts$/,
                use: ["ts-loader"],
                exclude:helper.resolve(__dirname,'./typings/jquery.d.ts')
            },
            {
                test: /\.tsx$/,
                use: ["ts-loader"]
            }
        ]
    }, externals: {
        "jQuery":"jQuery"
    },
    plugins:[
/*
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        })/*,
        new webpack.ProvidePlugin({
            Promise: 'es6-promise'
        })*/
    ]
};