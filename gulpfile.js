'use strict';

const { src, dest } = require('gulp');
const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const del = require('del');
const scss = require('gulp-sass');
const autorefixer = require('gulp-autoprefixer');
const groupMedia = require('gulp-group-css-media-queries');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const webphtml = require('gulp-webp-html');
const webpcss = require('gulp-webpcss');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fonter = require('gulp-fonter');
const fs = require('fs');

const PROJECT_FOLDER = require('path').basename(__dirname);
const SOURCE_FOLDER = '#src';

const path = {
   build: {
      html: PROJECT_FOLDER + '/',
      css: PROJECT_FOLDER + '/css/',
      js: PROJECT_FOLDER + '/js/',
      img: PROJECT_FOLDER + '/img/',
      fonts: PROJECT_FOLDER + '/fonts/'
   },
   src: {
      html: SOURCE_FOLDER + '/views/*.html',
      css: SOURCE_FOLDER + '/scss/style.scss',
      js: SOURCE_FOLDER + '/js/script.js',
      img: SOURCE_FOLDER + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
      fonts: SOURCE_FOLDER + '/fonts/*.ttf'
   },
   watch: {
      html: SOURCE_FOLDER + '/**/*.html',
      css: SOURCE_FOLDER + '/scss/**/*.scss',
      js: SOURCE_FOLDER + '/js/**/*.js',
      img: SOURCE_FOLDER + '/img/**/*.{jpg,png,gif,svg,ico,webp}',
   },
   clean: './' + PROJECT_FOLDER + '/'
};

const browserSync = (params) => {
   browsersync.init({
      server: {
         baseDir: './' + PROJECT_FOLDER + '/'
      },
      port: 3050,
      notify: false
   })
}

const html = () =>
   src(path.src.html)
      .pipe(fileInclude())
      .pipe(webphtml())
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream());

const images = () =>
   src(path.src.img)
      .pipe(webp({
         quality: 70
      }))
      .pipe(dest(path.build.img))
      .pipe(src(path.src.img))
      .pipe(imagemin({
         progressive: true,
         svgoPlugins: [{ removeViewBox: false }],
         interlaced: true,
         optimizationLevel: 3
      }))
      .pipe(dest(path.build.img))
      .pipe(browsersync.stream());

const js = () =>
   src(path.src.js)
      .pipe(fileInclude())
      .pipe(dest(path.build.js))
      .pipe(uglify())
      .pipe(
         rename({
            extname: '.min.js'
         })
      )
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream());

const css = () =>
   src(path.src.css)
      .pipe(
         scss({
            outputStyle: 'expanded'
         })
      )
      .pipe(
         autorefixer({
            overrideBrowserslist: ['last 5 versions'],
            cascade: true
         })
      )
      .pipe(webpcss({}))
      .pipe(groupMedia())
      .pipe(dest(path.build.css))
      .pipe(cleanCss())
      .pipe(
         rename({
            extname: '.min.css'
         })
      )
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream());

const fonts = () => {
   src(path.src.fonts)
      .pipe(ttf2woff())
      .pipe(dest(path.build.fonts))
   return src(path.src.fonts)
      .pipe(ttf2woff2())
      .pipe(dest(path.build.fonts))
}

const watchFiles = (params) => {
   gulp.watch([path.watch.html], html);
   gulp.watch([path.watch.js], js);
   gulp.watch([path.watch.css], css);
   gulp.watch([path.watch.img], images);
};

const clean = () => del(path.clean);

gulp.task('otf2ttf', () => {
   return src([SOURCE_FOLDER + '/fonts/*.otf'])
      .pipe(fonter({
         formats: ['ttf']
      }))
});

const fontsStyle = () => {
   const file_content = fs.readFileSync(SOURCE_FOLDER + '/scss/fonts.scss');
   if (file_content === '') {
      fs.writeFile(SOURCE_FOLDER + '/scss/fonts.scss', '', () => { });
      return fs.readdir(path.build.fonts, (err, items) => {
         if (items) {
            let c_fontname;
            for (let i = 0; i < items.length; i++) {
               const fontname = items[i].split('.');
               fontname = fontname[0];
               if (c_fontname !== fontname) {
                  fs.appendFile(SOURCE_FOLDER + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', () => { });
               }
               c_fontname = fontname;
            }
         }
      })
   }
}

const build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts), fontsStyle);
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.css = css;
exports.js = js;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;