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
                // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
                { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

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