const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const runSequence = require('run-sequence');
const merge = require('merge2');
const webpack = require('webpack');

const files = {
    library: ['src/**/*.ts', '!src/admin/client/**/*'],
    packageJsons: 'src/**/package.json',
    client: 'src/admin/client/index.html'
};

let shouldWatch = false;

gulp.task('default', ['build']);
gulp.task('clean', () => del(['dist']));
gulp.task('build', (cb) => runSequence('clean', ['build-library', 'build-admin-client'], cb));

gulp.task('watch', ['clean'], (cb) => {
    shouldWatch = true;

    runSequence(['build-library', 'build-admin-client'], () => {
        gulp.watch(files.library, ['build-library']);
        gulp.watch(files.packageJsons, ['build-library']);
        gulp.watch(files.client, ['copy-admin-client-files']);

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

gulp.task('build-admin-client', () => runSequence(['bundle-admin-client', 'copy-admin-client-files']));

gulp.task('bundle-admin-client', (cb) => {
    const webpackConfig = require('./webpack.client');
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
            if(!hasCalledBack) {
                cb();
                hasCalledBack = true;
            }

            console.log(stats.toString())
        })
    }
    
});

gulp.task('copy-admin-client-files', () => {
    return gulp.src(files.client)
    .pipe(gulp.dest('dist/admin/client'))
})