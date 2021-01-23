import del from 'del';
import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import ts from 'gulp-typescript';
import path from 'path';
import webpack from 'webpack';
import generateWebpackConfig from './webpack.client.mjs';


const { series, parallel, src, dest, watch } = gulp;

const OUTDIR = path.resolve('./dist');

const files = {
    library: [
        'src/**/*.@(ts|tsx)',
        '!src/admin/client/forms/examples/**/*.*',
    ],
    packageJsons: 'src/**/package.json',
};

let shouldWatch = false;
let isReleaseBuild = false;

export async function clean() {
    await del([OUTDIR]);
}

export function buildLibrary() {
    const tsProject = ts.createProject('./tsconfig.json');

    return src(files.library)
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write())
        // .pipe(src(files.packageJsons))
        .pipe(dest(OUTDIR));
}

export function buildAdminClient(cb) {
    const webpackOptions = {
        isReleaseBuild,
        outDir: OUTDIR,
    }

    const webpackConfig = generateWebpackConfig(webpackOptions);
    const bundler = webpack(webpackConfig);

    if (!shouldWatch) {
        bundler.run((err, stats) => {
            console.log(stats.toString());
            cb(err);
        })
    }
    else {
        let hasCalledBack;
        bundler.watch(null, (err, stats) => {
            if (!hasCalledBack) {
                cb();
                hasCalledBack = true;
            }

            console.log(stats.toString())
        })
    }
}

export const build = series(clean, parallel(buildLibrary, buildAdminClient));

export const buildWatch = series(
    function initWatch(cb) {shouldWatch = true; cb()},
    build,
    function watching(){ watch(files.library, buildLibrary) }
);

export const release = series(
    function setIsRelease(cb) {isReleaseBuild = true; cb()},
    build,
);


// gulp.task('release-forms', ['clean'], () => {
//     gulp.src([
//         './src/admin/client/forms/package.json',
//         './src/admin/client/forms/README.md'
//     ])
//     .pipe(gulp.dest(OUTDIR))

//     return rollup.rollup({
//         input: './src/admin/client/forms/index.ts',
//         external: [
//             'react'
//         ],
//         plugins: [
//             rollupTypescript({
//                 tsconfigOverride: {
//                     compilerOptions: {
//                         declaration: true,
//                         declarationDir: OUTDIR,
//                         module: 'ES2015',
//                         target: "ES5",
//                     },
//                     include: [
//                         './src/admin/client/forms/**/*'
//                     ]
//                 }
//             }),
//             rollupUglify()
//         ]
//     })
//         .then(bundle => {
//             return bundle.write({
//                 file: `${OUTDIR}/index.js`,
//                 format: 'umd',
//                 name: 'GhotiForms',
//                 globals: {
//                     react: 'React'
//                 },
//             });
//         });
// })