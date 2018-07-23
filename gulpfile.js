var gulp         = require('gulp'),
		sass         = require('gulp-sass'), // Sass компілятор в css
		concat       = require('gulp-concat'), // З'єднує (конкатенує) файли
		spritesmith  = require('gulp.spritesmith'), // Генерація спрайта
		autoprefixer = require('autoprefixer'), // PostCss autoprefixer - автоматично формує вендорні префікси
		cssmin       = require('gulp-cssmin'), // Мініфікація css
		uglify       = require('gulp-uglify'), // Мініфікація JS
		rename       = require('gulp-rename'), // Перейменування файлу
		postcss      = require('gulp-postcss'), // PostCss
		mqpacker     = require('css-mqpacker'), // Збирає всі медіа-запити в одному місці
		imagemin     = require('gulp-imagemin'),
		svgstore     = require('gulp-svgstore'),
		svgmin       = require('gulp-svgmin'),
		del          = require('del'), // Видаляє папки, файли
		run          = require('run-sequence'), // Запускає послідовно задачі
		plumber      = require('gulp-plumber'), // Відслідковування і вивід в консоль помилок
		notify       = require("gulp-notify"), // Вивід повідомлення про помилку
		cheerio      = require('gulp-cheerio'),
		browserSync  = require('browser-sync').create(); // Сервер

// Static server
gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		},
		// tunnel: 'sedona',
		notify: false
	});
});

// gulp.task('autopref', () =>
//     gulp.src('app/css/style.css')
//         .pipe(autoprefixer({
//             browsers: ['last 10 versions'],
//             cascade: false
//         }))
//         .pipe(gulp.dest('app/css'))
// );
gulp.task('styles', function() {
	return gulp.src('app/css/*.css')
	//.pipe(plumber())
	.pipe(sass({outputStyle: 'nested'}).on('error', notify.onError()))
	.pipe(postcss([
			autoprefixer({
				browsers: ['last 10 versions'],
				cascade: false
			}),
			mqpacker({
				// sort: true
			})
		]))
	.pipe(gulp.dest('app/css'))
	//.pipe(cssmin())
	//.pipe(rename({suffix: '.min'}))
	//.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream());
});

gulp.task('js', function() {
	return gulp.src('app/js/common.js')
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/js/'));
});

gulp.task('script', function() {
	return gulp.src([
			//'app/libs/jquery/dist/jquery.min.js',
			//'app/libs/jquery-mask-plugin/dist/jquery.mask.min.js',
			//'app/libs/owl.carousel/dist/owl.carousel.min.js',
			//'app/libs/jquery-validation/dist/jquery.validate.min.js',
			//'app/libs/jquery-popup-overlay/jquery.popupoverlay.js',
			//'app/libs/moment/min/moment.min.js',
			//'app/libs/moment/min/locales.min.js',
			//'app/libs/datetimepicker/build/js/bootstrap-datetimepicker.min.js',
			//'app/libs/jquery.countdown/dist/jquery.countdown.min.js',
			//'app/libs/fancybox/dist/jquery.fancybox.min.js'
		])
	.pipe(concat('script.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js/'));
});

gulp.task('sprite', function() {
	var spriteData = gulp.src('app/img/icon/*.png')
		.pipe(spritesmith({
		/* this whole image path is used in css background declarations */
		imgName: '../img/sprite.png',
		cssName: 'sprite.sass',
		padding: 2
		}));
	spriteData.img.pipe(gulp.dest('app/img'));
	spriteData.css.pipe(gulp.dest('app/sass'));
});


gulp.task('symbols', function() {
	return gulp.src('app/img/icon/*.svg')
		.pipe(svgmin())
		.pipe(svgstore({
			inlineSvg: true
		}))
		.pipe(cheerio({
			run: function($) {
				// $('[fill]').removeAttr('fill');
				// $('[style]').removeAttr('style');
				// $('[class]').removeAttr('class');
				// $('title').remove();
				// $('defs').remove();
				// $('style').remove();
				$('svg').attr('style', 'display:none');
			}
		}))
		.pipe(rename('symbols.html'))
		.pipe(gulp.dest('app/img'));
});

gulp.task('watch', function() {
	gulp.watch('app/css/**/*.css', ['styles']).on("change", browserSync.reload);
	gulp.watch('app/*.html').on("change", browserSync.reload);
	gulp.watch('app/js/scripts.js', ['js']).on("change", browserSync.reload);
});


/* Project transfer to prodaction */
gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('images', function() {
	return gulp.src('app/img/**/*.{png,jpg,gif,ico}')
		.pipe(imagemin([
			imagemin.optipng({optimizationLevel: 3}),
			imagemin.jpegtran({progressive: true})
		]))
		.pipe(gulp.dest('dist/img'))
});

gulp.task('svg', function() {
	return gulp.src('app/img/icon/*.svg')
		.pipe(svgmin())
		.pipe(gulp.dest('dist/img/icon'));
});

gulp.task('build', ['clean', 'styles', 'js', 'images', 'svg'], function(){
	gulp.src(['app/css/style.min.css'])
		.pipe(gulp.dest('dist/css'));

	gulp.src(['app/fonts/**/*'])
		.pipe(gulp.dest('dist/fonts'));

	gulp.src(['app/js/**/*'])
		.pipe(gulp.dest('dist/js'));

	gulp.src(['app/img/*.svg'])
		.pipe(svgmin())
		.pipe(gulp.dest('dist/img'));

	gulp.src(['app/img/symbols.html'])
		.pipe(gulp.dest('dist/img'));

	gulp.src(['app/*.html', 'app/*.php', 'app/.htaccess'])
		.pipe(gulp.dest('dist'));
});


gulp.task('default', ['styles', 'js', 'browser-sync', 'watch']);