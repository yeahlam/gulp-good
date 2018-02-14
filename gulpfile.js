var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var del = require('del');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var spriter = require('gulp-css-spriter');
var base64 = require('gulp-base64');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var runSequence = require('run-sequence');
var cssAutoPerfix = require('gulp-autoprefixer')
var gulpif = require('gulp-if')

var build = {
	basePath: './build/',
	css: './build/css/',
	images: './build/images/',
	js: './build/js/'
};

var src = {
	basePath: './src/',
	css: './src/css/',
	images: './src/images/',
	js: './src/js/',
	less: './src/less/',
	minijs: './src/minijs/'
};

var ifcombinejs = false; //是否合并JS
var ifcombindcss = false; //是否合并CSS
var ifmakeSpriter = false; //是否制作雪碧图
var ifrev = false; //是否打开版本管理

/*************************开发模式*************************/

// 开发模式下静态服务器
gulp.task('server:d', function() {
	browserSync.init({
		server: {
			baseDir: src.basePath,
			index: 'index.html'
		},
		port: 8080
	});

	gulp.watch("src/*.html", ["html:dev"]);
	gulp.watch("src/less/*.less", ["less"]);
	gulp.watch("src/css/*.css", ["css:dev"]);
	gulp.watch("src/js/*.js", ['js:dev']);

});

gulp.task('html:dev', function() {
	gulp.src([
			'./src/*.html'
		])
		.pipe(gulp.dest('./src/'))
		.pipe(reload({
			stream: true
		}))

});

gulp.task('less', function() {
	gulp.src(src.less + '*.less')
		.pipe(less())
		.pipe(gulp.dest(src.css))
		.pipe(reload({
			stream: true
		}))

});
/^(?!.+\.min.js$).+\.js$/
gulp.task('css:dev', function() {
	gulp.src([src.css + '*.css', '!' + src.css + '*.min.css', '!' + src.css + 'all.min.css', '!' + src.css + 'all.css'])
		.pipe(gulpif(ifcombindcss, concat('all.css')))
		.pipe(gulpif(ifmakeSpriter, spriter({
			'spriteSheet': src.images + 'spritesheet.png',
			'pathToSpriteSheetFromCSS': '../images/spritesheet.png'
		})))
		.pipe(cssAutoPerfix())
		.pipe(gulp.dest(src.css)) //输出一个未压缩版本

		.pipe(cleanCss())
		.pipe(gulpif(ifcombindcss, rename('./all.min.css')))
		.pipe(gulpif(!ifcombindcss, rename({
			suffix: '.min'
		})))
		.pipe(gulp.dest(src.css)) //输出一个压缩版本
		.pipe(reload({
			stream: true
		}))
});

gulp.task('js:dev', function() {
	gulp.src([src.js + '*.js', '!' + src.js + '*.min.js', '!' + src.js + 'all.js', '!' + src.js + 'all.min.js'])
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulpif(ifcombinejs, concat('all.js')))
		//.pipe(gulp.dest(src.js)) //输出一个未压缩版本
		.pipe(uglify())
		.pipe(gulpif(ifcombinejs, rename('./all.min.js')))
		.pipe(gulpif(!ifcombinejs, rename({
			suffix: '.min'
		})))
		.pipe(gulp.dest(src.js)) //输出一个压缩版本

		.pipe(reload({
			stream: true
		}))
});

/*************************生成模式*************************/
//生产模式下的服务器
gulp.task('server:p', function() {
	runSequence(['imagesmin', 'publish:html', 'publish:css', 'publish:js']);
	browserSync.init({
		server: {
			baseDir: build.basePath,
			index: 'index.html'
		},
		port: 8081
	});
});

//压缩图片，只限jpg和png
gulp.task('imagesmin', function() {
	gulp.src(src.images + '*.*')
		.pipe(imagemin())
		.pipe(gulp.dest(build.images))
});

gulp.task('publish:html', function() {
	gulp.src(src.basePath + '*.html')
		.pipe(gulp.dest(build.basePath))
});

gulp.task('publish:css', function() {
	if(ifcombindcss) {
		gulp.src(src.css + 'all.min.css')
			.pipe(gulpif(ifrev, rev())) //发布新版本
			.pipe(gulp.dest(build.css))
			.pipe(gulpif(ifrev, rev.manifest()))
			.pipe(gulpif(ifrev, gulp.dest('./rev/css/')))
	} else {
		gulp.src([src.css + '*.css', '!' + src.css + 'all.css', '!' + src.css + 'all.min.css'])
			.pipe(gulp.dest(build.css))
	}

});

gulp.task('publish:js', function() {
	if(ifcombinejs) {
		gulp.src(src.js + 'all.min.js')
			.pipe(gulpif(ifrev, rev())) //发布新版本
			.pipe(gulp.dest(build.js))
			.pipe(gulpif(ifrev, rev.manifest()))
			.pipe(gulpif(ifrev, gulp.dest('./rev/js/')))
	} else {
		gulp.src([src.js + '*.js', '!' + src.js + 'all.js', '!' + src.js + 'all.min.js'])
			.pipe(gulp.dest(build.js))
	}

});

gulp.task('del:build', function() {
	del([
		build.basePath
	]);
});

gulp.task('rev', function() {
	return gulp.src(['./rev/**/*.json', build.basePath + '*.html'])
		.pipe(revCollector({}))
		.pipe(gulp.dest(build.basePath));
});