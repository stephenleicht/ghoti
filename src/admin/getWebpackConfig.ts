import * as path from 'path';
import {Configuration} from 'webpack';

export default function getWebpackConfig(entryPath: string, outputPath: string): Configuration {
    const outputFileName = path.basename(outputPath);
    const outputDirName = path.dirname(outputPath);

    return {
        entry: entryPath,
        output: {
            filename: outputFileName,
            path: outputDirName,
        },

        // Enable sourcemaps for debugging webpack's output.
        devtool: "inline-source-map",

        context: process.cwd(),
        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: [".ts", ".tsx", ".js", ".json"],
            alias: {
                'reflect-metadata': require.resolve('reflect-metadata')
            }
        },

        module: {
            rules: [
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

                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                // { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
            ]
        },

        // externals: {
        //     "react": "React",
        //     "react-dom": "ReactDOM"
        // },
    };
}