const gulp = require("gulp");
const filter = require("gulp-filter");
const purify = require("gulp-purifycss");
const gzip = require("gulp-gzip");
const rename = require("gulp-rename");
const brotli = require("gulp-brotli");
const clean = require("gulp-clean");
const { series, parallel } = require("gulp");

// #1 | Optimize CSS
/*
  Steps:
  Filter the CSS files to be optimized
  Based on their usage in Build JS files
  & Store the optimize file in the given location
*/
gulp.task("css", () => {
  return gulp
    .src("dist/ecommerce-frontend-new/*")
    .pipe(filter(["**/styles.*.css"]))
    .pipe(
      purify(["dist/ecommerce-frontend-new/*.js"], {
        info: true,
        minify: true,
        // rejected: true,
        // whitelist: [],
      })
    )
    .pipe(gulp.dest("dist/test/")); /* Optimized file output location */
});

// # 2 | Genereate GZIP files
/*
Steps:
Read the optimized CSS in the Step #1
Apply gzip compression
*/
gulp.task("css-gzip", () => {
  return gulp
    .src("dist/test/*")
    .pipe(filter(["**/*.css", "!**/*.br.*", "!**/*.gzip.*"]))
    .pipe(gzip({ append: false }))
    .pipe(
      rename((path) => {
        path.extname = path.extname + ".gz";
      })
    )
    .pipe(gulp.dest("dist/test/"));
});

// # 3 | Genereate BROTLI files
/*
Steps:
Read the optimized CSS in the Step #1
Apply brotli compression
*/
gulp.task("css-br", () => {
  return gulp
    .src("dist/test/*")
    .pipe(filter(["**/*.css", "!**/*.br.*", "!**/*.gz.*"]))
    .pipe(brotli.compress())
    .pipe(
      rename((path) => {
        path.extname = path.basename.substring(path.basename.lastIndexOf("."), path.basename.length) + ".br";
        path.basename = path.basename.substring(0, path.basename.lastIndexOf("."));
      })
    )
    .pipe(gulp.dest("dist/test"));
});

// # 4 | Clear ng-build CSS
/*
Delete style output of Angular prod build
*/
gulp.task("clear-ng-css", () => {
  return gulp
    .src("dist/ecommerce-frontend-new/*")
    .pipe(filter(["**/styles*.css"]))
    .pipe(clean({ force: true }));
});

// # 5 | Copy optimized CSS
/*
Once the optimization & compression is done,
Replace the files in angular build output location
*/
gulp.task("copy-op-css", () => {
  return gulp.src("dist/test/*").pipe(gulp.dest("dist/ecommerce-frontend-new"));
});
// #6 | Clear temp folder
gulp.task("clear-test", () => {
  return gulp.src("dist/test/", { read: false }).pipe(clean({ force: true }));
});

/*
 ### Order of Tasks ###
 * Optimize the styles generated from ng build
 * Create compressed files for optimized css
 * Clear the angular build output css
 * Copy the optimized css to ng-bundle folder
 * Clear the temp folder
 */
exports.default = series("css", parallel("css-gzip", "css-br"), "clear-ng-css", "copy-op-css", "clear-test");
