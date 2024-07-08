var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry:{
        formSelector:'./src/SFFormSelector.tsx'
    },
    output: {
        path:path.join(__dirname, "dist"),
        filename: "[name]_bundle.js"
    },
    mode:'development',
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    externals: {
        jquery: 'jQuery'
    },
    devServer: {
        contentBase: path.join(__dirname+'/../', "dist"),
        compress: false,
        port: 4200
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {test: /\.css$/, "use": ["style-loader",'css-loader']},
            {  test: /\.scss$/, use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]}
        ]
    }

};



