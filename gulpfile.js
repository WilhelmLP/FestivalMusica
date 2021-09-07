//Funciones que se importan de gulp por medio de desestructuring
const { series, src, dest, watch, parallel } = require("gulp");
const sass = require("gulp-sass")(require("dart-sass"));
const imagemin = require("gulp-imagemin");
const notify = require("gulp-notify");
const webp = require("gulp-webp");
const concat = require("gulp-concat");
sass.compiler = require("dart-sass");

//Utilidades de CSS
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");

//Utilidades de JS
const terser = require("gulp-terser-js");

const paths = {
  imagenes: "src/img/**/*",
  ruta_sass: "src/scss/**/*.scss",
  js: "src/js/**/*.js",
};

//Funcion que compila SASS
function scss() {
  return src(paths.ruta_sass)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("./build/css"));
}

//Funcion que minifica el CSS
function minificarCSS() {
  return src(paths.ruta_sass)
    .pipe(
      sass({
        outputStyle: "compressed",
      })
    )
    .pipe(dest("./build/css"));
}

//Función Javascript
function Javascript() {
  return src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(concat("bundle.js"))
    .pipe(terser())
    .pipe(sourcemaps.write("."))
    .pipe(rename({ sufix: ".min" }))
    .pipe(dest("./build/js"));
}

//Minificar Imagenes
function minificarImagenes() {
  return src(paths.imagenes)
    .pipe(imagemin())
    .pipe(dest("./build/img"))
    .pipe(notify({ message: "Imagen Modificada" }));
}

//Función que convierte en Webp
function versionWebp() {
  return src(paths.imagenes)
    .pipe(webp())
    .pipe(dest("./build/img"))
    .pipe(notify({ message: "Versión Webp lista" }));
}

//Compilación automatica
function watchArchivos() {
  watch(paths.ruta_sass, scss); // * = carpeta actual y ** = todos los archivos con .scss
  watch(paths.js, Javascript);
}

exports.scss = scss;
exports.Javascript = Javascript;
exports.minificarCSS = minificarCSS;
exports.minificarImagenes = minificarImagenes;
exports.watchArchivos = watchArchivos;

exports.default = series(
  scss,
  Javascript,
  minificarImagenes,
  versionWebp,
  watchArchivos
);
