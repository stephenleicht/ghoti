const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src/admin/client/main.tsx'),
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist/admin/client'),
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "inline-source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"],
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
        ]
    }
};
