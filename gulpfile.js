var gulp = require('gulp');
var svgSymbols = require('gulp-svg-symbols');
var htmlclean = require('gulp-htmlclean');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var cheerio = require('gulp-cheerio');
var file = require('gulp-file');
var watch = require('gulp-watch');
var babel = require('gulp-babel');
var fs = require('fs');


gulp.task('svg-sequence', function(cb) {
    runSequence('svg-build', 'inject-svg', cb);
});


//generate svg file
gulp.task('svg-build', function() {
    var allIcons = [];

    var stream = gulp.src('build/svg/*.svg')
        .pipe(svgSymbols({
            templates: [ 'default-svg' ],
            transformData: function(svg, defaultData) {
                allIcons.push(defaultData.id);
                return defaultData;
            }
        }))
        .pipe(htmlclean())
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
            }
        }))
        .pipe(gulp.dest('dist'));

    //when the stream is done, allIcons is full, so we can output it
    stream.on('end', function() {
         fs.writeFile('./dist/icons-manifest.json', JSON.stringify(allIcons, null, 4));
    });

    return stream;
});


//inline SVG defs into JS file
gulp.task('inject-svg', function(){

    var svgArray = fs.readdirSync('build/svg').filter(function(file) {
        //filter out .DS_Store, etc
        return file.indexOf('.') !== 0;
    });
    var tempFile = '';
    var svgObject = {};

    for (var i = 0; i < svgArray.length; i++) {
        tempFile = fs.readFileSync('build/svg/'+svgArray[i], 'utf8');

        // remove line breaks
        tempFile = tempFile.replace(/\r\n|\r|\n/gm, '');

        // remove <xml> <!--comments--> <!DOCTYPE> <style>
        tempFile = tempFile.replace(/<\?xml.+\?>|<!--.+-->|<!DOCTYPE.+d">|<style.+style>/g, '');

        // remove all fill attribute
        tempFile = tempFile.replace(/fill=+(["'])(\\?.)*?\1/g, "");

        //remove extra white space
        tempFile = tempFile.replace(/\s+/g, " ");

        // add to json object string
        svgObject[svgArray[i].slice(0,-4)] = tempFile;
    }

    return gulp.src(['build/tute-icons.js'])
        .pipe(babel())
        .pipe(replace('__REPLACE__', JSON.stringify(svgObject)))
        .pipe(gulp.dest('dist'));
});


//generate demo page
gulp.task('demo', function () {
    return gulp.src('build/svg/*.svg')
      .pipe(svgSymbols.demoPage())
      .pipe(gulp.dest('dist'));
});


gulp.task('copy-css', function() {
    return gulp.src('build/tute-icons.css')
        .pipe(gulp.dest('dist'))
});


gulp.task('watch', function() {
    watch('build/**/*', function() {
        gulp.start('build');
    });
});


gulp.task('build', ['svg-sequence' ,'demo', 'copy-css']);

gulp.task('default', ['build', 'watch'])
