// const path = require('path');
// const gulp = require('gulp');
// const ts = require('gulp-typescript');
// const sourcemaps = require('gulp-sourcemaps');
// const del = require('del');
// const runSequence = require('run-sequence');
// const merge = require('merge2');
// const webpack = require('webpack');
// const rollup = require('rollup');
// const rollupTypescript = require('rollup-plugin-typescript2');
// const rollupUglify = require('rollup-plugin-uglify')

import del from 'del';
import path from 'path';
import gulp from 'gulp';
import ts from 'gulp-typescript';
import sourcemaps from 'gulp-sourcemaps';
import webpack from 'webpack';

import generateWebpackConfig from './webpack.client.mjs';

const { series, parallel, src, dest, watch } = gulp;

const OUTDIR = path.resolve('./dist');

const files = {
    library: [
        'src/**/*.@(ts|tsx)',
        '!src/admin/client/forms/examples/**/*.*',
        // '!src/example/**/*/*'
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
        .pipe(src(files.packageJsons))
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

export const buildWatch = series(async () => {
    shouldWatch = true;
    watch(files.library, buildLibrary)
    return;
}, build)
// gulp.task('release', (cb) => {
//     isReleaseBuild = true;
//     runSequence('build', cb);
// })

// gulp.task('watch', ['clean'], (cb) => {
//     shouldWatch = true;

//     runSequence(['build-library', 'build-admin-client'], () => {
//         gulp.watch(files.library, ['build-library']);
//         gulp.watch(files.packageJsons, ['build-library']);

//         cb();
//     })
// })

// gulp.task('build-library', () => {
//     const tsProject = ts.createProject('./tsconfig.json');

//     return merge([
//         gulp.src(files.library)
//             .pipe(sourcemaps.init())
//             .pipe(tsProject())
//             .pipe(sourcemaps.write())
//             .pipe(gulp.dest(OUTDIR)),

//         gulp.src(files.packageJsons)
//             .pipe(gulp.dest(OUTDIR))
//     ]);
// })

// gulp.task('build-admin-client', () => runSequence(['bundle-admin-client']));

// gulp.task('bundle-admin-client', (cb) => {
//     const webpackOptions = {
//         isReleaseBuild,
//         outDir: OUTDIR,
//     }

//     const webpackConfig = require('./webpack.client')(webpackOptions);
//     const bundler = webpack(webpackConfig);

//     if (!shouldWatch) {
//         bundler.run((err, stats) => {
//             console.log(stats.toString());
//             cb(err);
//         })
//     }
//     else {
//         let hasCalledBack;
//         bundler.watch(null, (err, stats) => {
//             if (!hasCalledBack) {
//                 cb();
//                 hasCalledBack = true;
//             }

//             console.log(stats.toString())
//         })
//     }

// });

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