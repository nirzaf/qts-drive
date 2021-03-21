const gulp = require('gulp');
const HubRegistry = require('gulp-hub');

const cheerio = require('cheerio');
const rimraf = require('rimraf');
const fs = require('fs');

const hub = new HubRegistry(['tasks/*.js']);
gulp.registry(hub);

gulp.task('dist', function(done) {
    //remove old dist files from laravel public folder
    //gulp.src('./../server/public/client', {read: false}).pipe(clean({force: true}));
    rimraf.sync('./../server/public/client');

    //copy dist folder into laravel public folder
    gulp.src(['./dist/client/browser/**/*', '!./dist/client/browser/index.html', '!./dist/client/browser/stats.json']).pipe(gulp.dest('./../server/public/client'));

    const $ = cheerio.load(fs.readFileSync('./dist/client/browser/index.html', 'utf8'));

    //get script tags that need to be injected into main laravel view
    const scripts = $('script').map(function(i, el) {
        return $('<div>').append($(el)).html();
    }).toArray();

    //get css tags that need to be injected into main laravel view
    const styles = $('link').filter(function(i, el) {
        return $(el).attr('href').indexOf('client/styles.') > -1;
    }).map(function(i, el) {
        return $('<div>').append($(el)).html();
    }).toArray();

    //js scripts replace regex
    const jsSearch = /{{--angular scripts begin--}}[\s\S]*{{--angular scripts end--}}/;
    const jsReplaceStr = '{{--angular scripts begin--}}' + "\n\t\t" + scripts.join("\n\t\t") + "\n\t{{--angular scripts end--}}";

    //css styles replace regex
    const cssSearch = /{{--angular styles begin--}}[\s\S]*{{--angular styles end--}}/;
    const cssReplaceStr = '{{--angular styles begin--}}' + "\n\t\t" + styles.join("\n\t\t") + "\n\t{{--angular styles end--}}";

    const laravelViewPath = './../server/resources/views/app.blade.php';

    //replace app stylesheet links and js script tags with new ones
    let content = fs.readFileSync(laravelViewPath, 'utf8');
    content = content.replace(jsSearch, jsReplaceStr).replace(cssSearch, cssReplaceStr);

    fs.writeFileSync(laravelViewPath, content, 'utf8');
    done();
});

