import * as path from 'path';

export default function getWebpackConfig(entryPath: string, outputPath: string) {
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

        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: [".ts", ".tsx", ".js", ".json"],
            modules: [
                '../node_modules'
            ]
        },

        module: {
            rules: [
                // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
                { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

                // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
                // { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
            ]
        },

        externals: {
            "react": "React",
            "react-dom": "ReactDOM"
        },
    };
}