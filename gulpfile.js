'use strict';

const gulp = require('gulp');
const runSequence = require('run-sequence');

const sync = require('browser-sync').create();

const rollup = require('gulp-rollup');
const buble = require('rollup-plugin-buble');
const eslint = require('rollup-plugin-eslint');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');

const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const autoprefixer = require('gulp-autoprefixer');

const config = {
    js : {
        src : ['src/js/**/**.js'],
        dest : 'dist/js/',
        entry : './src/js/imagecrop.js',
    },
    docs : {
        js : {
            src : ['src/docs/**/**.js'],
            dest : './docs/',
            entry : './src/docs/app.js'
        },
        scss : {
            src : ['src/docs/**/**.scss'],
            dest : './docs/',
        }
    },
    scss : {
        src : ['src/sass/**/**.scss'],
        dest : 'dist/css/',
    },
};

//
//  UTILITIES
//

    function doRollup (component) {
        return gulp.src(component.src)
        .pipe(
            rollup({
                entry : component.entry,
                format : 'iife',
                moduleName : 'ImageCropper',
                plugins : [
                    resolve({
                        jsnext : true,
                        main : true,
                        browser : true,
                    }),
                    commonjs(),
                    eslint('.eslintrc'),
                    buble(),
                    uglify()
                ],
            })
        )
        .pipe(rename({
            suffix : '.min'
        }))
        .pipe(gulp.dest(component.dest));
    }

    function doSCSS (component) {
        return gulp.src(component.src)
            .pipe(sassLint({
                options : {
                    configFile : '.sass-lint.yml'
                }
            }))
            .pipe(sassLint.format())
            .pipe(sass({
                outputStyle : 'compressed'
            }))
            .pipe(autoprefixer())
            .pipe(rename({
                suffix : '.min'
            }))
            .pipe(gulp.dest(component.dest));
    }

//
//  SOURCE TASKS
//

    gulp.task('js', () => doRollup(config.js).pipe(gulp.dest('docs/dist')));
    gulp.task('scss', () => doSCSS(config.scss).pipe(gulp.dest('docs/dist')));

    gulp.task('docs:js', () => doRollup(config.docs.js));
    gulp.task('docs:scss', () => doSCSS(config.docs.scss));
    gulp.task('docs', () => runSequence('docs:js', 'docs:scss'));

//
//  BUILD TASKS
//

    gulp.task('reload', () => sync.reload());

    gulp.task('serve', ['dist'], (cb) => {
        sync.init({
            server : ['./docs', './dist'],
            index : 'index.html',
            files : ['./dist/js/imagecrop.min.js', './dist/css/imagecrop.min.css', './docs/index.html', './docs/app.min.js']
        });

        gulp.watch(config.scss.src, () => runSequence('scss', 'reload'));
        gulp.watch(config.js.src, () => runSequence('js', 'reload'));
        gulp.watch(config.docs.js.src, () => runSequence('docs:js', 'reload'));
        gulp.watch(config.docs.scss.src, () => runSequence('docs:scss', 'reload'));
    });

    gulp.task('dist', (cb) => runSequence('js', 'scss', 'docs', cb));

    //  Wrapper task for building all files, and watching for changes.
    gulp.task('default', () => runSequence('serve'));
