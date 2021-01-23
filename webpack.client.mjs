import { dirname, resolve } from 'path';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import { fileURLToPath } from 'url';
import webpack from 'webpack';


export default function (options) {
    return {
        entry: resolve(dirname(fileURLToPath(import.meta.url)), 'src/admin/client/main.tsx'),
        output: {
            filename: 'main.bundle.js',
            path: resolve(options.outDir, 'admin/client'),
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
                { test: /\.tsx?$/, loader: "ts-loader" },
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