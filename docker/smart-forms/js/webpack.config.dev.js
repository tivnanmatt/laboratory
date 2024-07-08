var path = require('path');
var webpack = require('webpack');
var helper=require('path');
module.exports = {
    mode: 'development',
    entry: {
        addnewtutorial: './tutorials2/AddNewTutorial.ts'
    },
    output: {
        filename: './Bundle/[name]_bundle.js'
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
                enforce: "pre",
                exclude:helper.resolve(__dirname,'../../node_modules/@types/es6-promise')
            },
            {
                test: /\.jsx$/,
                use: ["source-map-loader"],
                enforce: "pre",
                exclude:helper.resolve(__dirname,'../../node_modules/@types/es6-promise')
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
    }/*,
    plugins:[
        new webpack.ProvidePlugin({
            Promise: 'es6-promise'
        })
    ]*/
};