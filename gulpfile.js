const gulp = require("gulp");
const { src, dest, watch, series } = gulp;

const rename = require("gulp-rename");
const sass = require("gulp-sass");
const minify = require("gulp-minify-css");
const uglify = require("gulp-uglify");
const browsersync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");

function compileSass() {
	return src("./src/styles/styles.scss")
		.pipe(sass())
		.pipe(minify())
		.pipe(rename({ suffix: ".min" }))
		.pipe(dest("./build/static/css/"));
}

function minifyJs() {
	return src("./src/scripts/*")
		.pipe(uglify())
		.pipe(rename({ suffix: ".min" }))
		.pipe(dest("./build/static/js/"));
}

function initializeServer(cb) {
	browsersync.init({
		server: {
			baseDir: "./build/",
		},
	});
	cb();
}

function browserSyncReload(cb) {
	browsersync.reload();
	cb();
}

function watchTask() {
	watch("./src/styles/*", compileSass, browserSyncReload);
	watch("./src/scripts/*", minifyJs, browserSyncReload);
	watch("./build/index.html", browserSyncReload);
}

function minifyImages() {
	return src("./src/img/*").pipe(imagemin()).pipe(dest("./build/static/img/"));
}

exports.default = series(initializeServer, watchTask);
exports.img = minifyImages();
