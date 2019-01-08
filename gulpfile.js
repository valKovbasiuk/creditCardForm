let gulp = require("gulp");
let sass = require("gulp-sass");
let browserSync = require("browser-sync");
// let nunjucksRender = require("gulp-nunjucks-render");
// let concat = require('gulp-concat');
// let rename = require('gulp-rename');
// let uglify = require('gulp-uglify');

gulp.task("sass", function() {
  gulp
    .src("./src/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./docs/css"))
    .pipe(browserSync.reload({ stream: true }));
});

// gulp.task("nunjucks", function () {
//     // Gets .html and .nunjucks files in pages
//     return (
//         gulp
//             .src("./src/pages/**/*.html")
//             // Renders template with nunjucks
//             .pipe(
//                 nunjucksRender({
//                     path: ["./src/templates"]
//                 })
//             )
//             // output files in app folder
//             .pipe(gulp.dest("./build"))
//     );
// });

gulp.task("index.html", function() {
  return gulp.src("./src/index.html").pipe(gulp.dest("./docs"));
});

gulp.task("copy:img", function() {
  return gulp.src("./src/img/**/*").pipe(gulp.dest("./docs/img"));
});

gulp.task("serv", function() {
  browserSync.init({
    server: {
      baseDir: "./docs"
    },
    notify: false
  });
  browserSync.watch("./docs/**/*", browserSync.reload);
});

gulp.task("scripts", function() {
  return (
    gulp
      .src("./src/js/**/*.js")
      // .pipe(concat('scripts.js'))
      .pipe(gulp.dest("./docs/js/"))
    // .pipe(uglify())
    // .pipe(rename('scripts.min.js'))
  );
});

gulp.task(
  "default",
  ["index.html", "sass", "copy:img", "serv", "scripts"],
  function() {
    gulp.watch("./src/*.html", ["index.html"]);
    gulp.watch("./src/scss/**/*.scss", ["sass"]);
    // gulp.watch("./src/templates/**/*.html", ["nunjucks"]);
    gulp.watch("./src/img/**/*", ["copy:img"]);
    gulp.watch("./src/js/**/*.js", ["scripts"]);
    gulp.watch("./docs/**/*", browserSync.reload);
  }
);
