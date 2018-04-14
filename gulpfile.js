const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const runSequence = require('run-sequence');
const merge = require('merge2');
const webpack = require('webpack');

const files = {
    library: [
        'src/**/*.@(ts|tsx)',
    ],
    packageJsons: 'src/**/package.json',
};

let shouldWatch = false;
let isReleaseBuild = false;

gulp.task('default', ['build']);
gulp.task('clean', () => del(['dist']));
gulp.task('build', (cb) => runSequence('clean', ['build-library', 'build-admin-client'], cb));

gulp.task('release', (cb) => {
    isReleaseBuild = true;
    runSequence('build', cb);
})

gulp.task('watch', ['clean'], (cb) => {
    shouldWatch = true;

    runSequence(['build-library', 'build-admin-client'], () => {
        gulp.watch(files.library, ['build-library']);
        gulp.watch(files.packageJsons, ['build-library']);

        cb();
    })
})

gulp.task('build-library', () => {
    const tsProject = ts.createProject('./tsconfig.json');

    return merge([
        gulp.src(files.library)
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('dist')),

        gulp.src(files.packageJsons)
            .pipe(gulp.dest('dist'))
    ]);
})

gulp.task('build-admin-client', () => runSequence(['bundle-admin-client']));

gulp.task('bundle-admin-client', (cb) => {
    const webpackOptions = {
        isReleaseBuild
    }

    const webpackConfig = require('./webpack.client')(webpackOptions);
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

});