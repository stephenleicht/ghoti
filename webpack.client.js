const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (options) => {
    return {
        entry: path.resolve(__dirname, 'src/admin/client/main.tsx'),
        output: {
            filename: 'main.bundle.js',
            path: path.resolve(__dirname, 'dist/admin/client'),
        },
    
        devtool: options.isReleaseBuild ? false : "inline-source-map",
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"],
        },
        plugins: [
            new webpack.WatchIgnorePlugin([
                /css\.d\.ts$/
            ]),
            ...(options.isReleaseBuild ? [
                new UglifyJSPlugin()
            ] : [])
        ],
    
        module: {
            rules: [
                // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
                { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
                {
                    test: /\.css$/,
                    use: [{
                        loader: 'style-loader'
                    }, {
                        loader: 'typings-for-css-modules-loader',
                        options: {
                            modules: true,
                            namedExport: true
                        }
                    }]
                }
            ]
        }
    };
    
}