const cheerio = require('cheerio');
const ts = require('typescript');
const gulp = require('gulp');
const fs = require('fs');

const CLIENT_APP_PATH="./src/app/";
const COMMON_PATH="./src/common";

gulp.task('i18n', done => {
    let files = [
        ...getFilesInPath(CLIENT_APP_PATH, '.html'),
        ...getFilesInPath(COMMON_PATH, '.html'),
    ];
    let fromHtml = {};

    files.forEach(function(path) {
        const content = fs.readFileSync(path, 'utf8'),
            $ = cheerio.load(content);

        $('[trans], [trans-placeholder], [trans-title], [itemsName]').each(function(i, el) {
            let $el = $(el), text;

            // extract input placeholder attribute
            if ($el.attr('placeholder') && $el.attr('placeholder').length) {
                text = $el.attr('placeholder');
            }

            // extract node title attribute
            else if ($el.attr('trans-title') && $el.attr('trans-title').length) {
                text = $el.attr('title');
            }

            // extract custom "itemsName" attribute
            else if ($el.attr('itemsname') && $el.attr('itemsname').length) {
                text = $el.attr('itemsname');
            }

            // extract node text content
            else {
                text = $el.text();
            }

            const key = text.trim();
            fromHtml[key] = key;
        });

        // extract "trans" pipe used on simple strings:
        // {{ 'some string' | trans }}
        const stringRegex = new RegExp(/{{\s?'(.+?)'\s?\|\s?trans\s?}}/g);
        let sMatches;
        while ((sMatches = stringRegex.exec(content)) != null) {
            fromHtml[sMatches[1]] = sMatches[1];
        }

        // extract "trans" pipe used in attributes:
        // [matTooltip]="'Some String' | trans"
        const tooltipRegex = new RegExp(/="\s?'(.+?)'\s?\|\s?trans"/g);
        let tMatches;
        while ((tMatches = tooltipRegex.exec(content)) != null) {
            fromHtml[tMatches[1]] = tMatches[1];
        }
    });

    // concat lines from ts files
    fromHtml = {
        ...fromHtml,
        ...extractTranslationsFromTsFiles()
    };

    // remove "dynamic" lines
    Object.keys(fromHtml).forEach(key => {
        if ((key.indexOf('{{') > -1 && key.indexOf('}}') > -1)) {
            delete fromHtml[key];
        }
    });

    // add static lines that won't be extracted
    fromHtml = {...fromHtml, ...{
        'Items per page': 'Items per page',
        'Next page': 'Next page',
        'Previous page': 'Previous page',
        'of': 'of',
        'month': 'Month',
        'year': 'Year',
        'All types allowed...': 'All types allowed...',
        'No types blocked...': 'No types blocked...',
    }};

    fs.writeFileSync('./../server/resources/client-translations.json', JSON.stringify(fromHtml), 'utf8');
    done();
});

function extractTranslationsFromTsFiles() {
    let files = getFilesInPath('./src', '.ts');
    let lines = {};

    files.forEach(path => {
        // don't need to parse spec or module files
        if (path.indexOf('.spec') > -1 || path.indexOf('.module') > -1) return;

        const content = fs.readFileSync(path, 'utf8');

        // extract "confirmation modal" strings
        lines = {...lines, ...getAllMatches(/title:\s*'(.+?)',?/g, content)};
        lines = {...lines, ...getAllMatches(/body:\s*'(.+?)',?/g, content)};
        lines = {...lines, ...getAllMatches(/ok:\s*'(.+?)',?/g, content)};

        // extract "toast" strings
        lines = {...lines, ...getAllMatches(/this.toast.open\('(.+?)'\);/g, content)};

        // extract names and descriptions from config
        const names = {
            ...getAllMatches(/{\s*name:\s*'(.+?)',?/g, content),
            ...getAllMatches(/\s*description:\s*'(.+?)',?/g, content),
        };
        const transformed = {};
        for (let name in names) {
            const n = name.replace(/-/g, ' ');
            transformed[n] = n;
        }
        lines = {...lines, ...transformed};
    });

    return lines;
}

function getAllMatches(regexString, content) {
    const regex = new RegExp(regexString);
    const lines = {};
    let matches;
    while ((matches = regex.exec(content)) != null) {
        lines[matches[1]] = matches[1];
    }
    return lines;
}

/**
 * Get a list of all files with matching extension is specified directory.\
 * @return string[];
 */
function getFilesInPath(dir, extension, filelist) {
    if (dir[dir.length-1] !== '/') dir = dir.concat('/');

    const files = fs.readdirSync(dir);
    filelist = filelist || [];

    files.forEach(function(file) {
        if (fs.statSync(dir + file).isDirectory()) {
            filelist = getFilesInPath(dir + file + '/', extension, filelist);
        }
        else {
            if (file.indexOf(extension) > -1) {
                filelist.push(dir+file);
            }
        }
    });

    return filelist;
}