// Adiciona os modulos instalados
const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const notify = require('gulp-notify');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const del = require('del');

// Variavel para armazenar os JS dos plugins/frameworks
var pluginsJS = [
  'node_modules/jquery/dist/jquery.min.js',
	'node_modules/jquery-mask-plugin/dist/jquery.mask.min.js',
  'node_modules/popper.js/dist/umd/popper.js',
  'node_modules/bootstrap/dist/js/bootstrap.min.js'
]

// Variavel para armazenar os CSS dos plugins/frameworks
var pluginsCSS = [
  'node_modules/bootstrap/scss/**/*.scss'
]

// Variavel para armazenar os caminhos
var path = {
  dist: {
    html: './dist/',
    js: './dist/js/',
    css: './dist/css/',
    img: './dist/img/',
    fonts: './dist/fonts/'
  },
  src: {
    src: './src/',
    html: './src/*.html',
    js: './src/js/',
    style: './src/scss/',
    img: './src/img/**/*.*',
    fonts: './src/fonts/**/*.*'
  },
  watch: {
    html: './src/**/*.html',
    php: './src/**/*.php',
    js: './src/js/**/*.js',
    style: './src/scss/**/*.scss',
    img: './src/img/**/*.*',
    fonts: './src/fonts/**/*.*'
  }
};

//Funções para deletar cache
function cleanCacheCss() {
	del(path.dist.css + 'style.css')
}

function cleanCacheJs() {
	del(path.dist.js + 'app.js')
}

//Função para  minificar Html
function buildHtml() {
	return gulp.src(path.src.html)
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest(path.dist.html))
	.pipe(browserSync.stream());
}
gulp.task('html', buildHtml)


//Função para compilar o SASS e adicionar os prefixos
function buildScss() {
  return gulp
  .src(path.src.style + 'style.scss')
  .pipe(concat('style.css'))
  .pipe(autoprefixer({browsers: ['last 2 versions'],cascade: false}))
  .pipe(sass({outputStyle: 'compressed'}))
  .on('error', notify.onError({title: "erro scss", message: "<%= error.message %>"}))
  .pipe(gulp.dest(path.dist.css))
  .pipe(browserSync.stream());
}
gulp.task('sass', function(done){
	cleanCacheCss();
	buildScss();
  done();
});

// Função para pegar os plugins/frameworks necessarios de CSS para o projeto e cria dentro da pasta src para utilização
function buildFrameworksCSS() {
  return gulp.src(pluginsCSS)
  .pipe(gulp.dest(path.src.style + 'bootstrap'))
  .pipe(browserSync.stream());
}
gulp.task('buildFrameworksCSS', buildFrameworksCSS)

// Função para criar o JS exclusivo da aplicação
function buildJs() {
  return gulp.src(path.src.js + '**/*js')
  .pipe(concat('app.js'))
  .pipe(babel({presets: ['@babel/env'] }))
  .pipe(uglify())
  .pipe(gulp.dest(path.dist.js))
  .pipe(browserSync.stream());
}
gulp.task('appjs', function(done){
	cleanCacheJs();
	buildJs();
  done();
});

// Função para pegar os plugins/frameworks necessarios de JS para o projeto e concatenar em um único arquivo.
function buildFrameworksJS() {
  return gulp.src(pluginsJS)
  .pipe(concat('main.js'))
  .pipe(uglify())
  .pipe(gulp.dest(path.dist.js))
  .pipe(browserSync.stream());
}
gulp.task('buildFrameworksJS', buildFrameworksJS)

// Tarefa para executar as tarefas dos plugins/frameworks necessarios para a aplicação
gulp.task('buildFrameworks', gulp.parallel('buildFrameworksCSS', 'buildFrameworksJS'));

// Função para iniciar o browser
function browser() {
  browserSync.init({
    // proxy: 'localhost:8080'
    port: 8080,
    server: {
      baseDir: path.dist // diretorio da raiz ./dist/
    }
  })
}
gulp.task('browser-sync', browser);

// Função de watch do Gulp
function watch() {
  gulp.watch(path.watch.style, buildScss);
  gulp.watch(path.watch.js, buildJs);
  gulp.watch(path.watch.html, buildHtml);
  gulp.watch([path.watch.html, path.watch.php]).on('change', browserSync.reload);
}
gulp.task('watch', watch);

//Tarefa padrão do Gulp
gulp.task('default', gulp.parallel('watch', 'browser-sync', 'sass', 'appjs' , 'html'));
