const svgSprite = require('gulp-svg-sprite');
const gulp = require('gulp');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');
const fs     = require('fs');
const filter = require('gulp-filter');

const iconSet = 'individual';

gulp.task('icons', function () {
    const iconNames = getIconNames();

    // order is important, local icons should override common ones
    return gulp.src([
        'src/assets/icons/' + iconSet + '/*.svg',
        'src/common/assets/icons/*.svg',
    ])

    //filter out svg icons that are not used in project
    .pipe(filter(function(file) {
        return iconNames.indexOf(normalizeIconName(file.path)) > -1;
    }))

    //normalize icon names
    .pipe(rename(function (file) {
        file.basename = normalizeIconName(file.basename);
    }))

    //compile, minify and store svg on disk.
    .pipe(svgmin())
    .pipe(svgSprite({
        shape: {
            id: {
                generator: function(name, file) {
                    const parts = name.split('/');
                    return parts[parts.length - 1].replace('.svg', '');
                }
            },
        },
        mode: {
            defs: true,
            inline: true,
        }
    }))
    .pipe(rename('icons/merged.svg'))
    .pipe(gulp.dest('src/assets'))
    .pipe(gulp.dest('../server/public/client/assets'));
});

/**
 * Normalize icon file name.
 * "ic_icon_name_24px.svg" to "icon-name"
 */
function normalizeIconName(path) {
    const filename = path.replace(/^.*[\\\/]/, '');
    return filename.replace(/[_=]/g, '-').replace('.svg', '');
}

/**
 * Extract names of icons that should be included into
 * compiled svg file from project .html files.
 */
function getIconNames() {
    const htmlFiles = [...getFilesInPath('./src/app', '.html'), ...getFilesInPath('./src/common', '.html')];
    const tsFiles = [...getFilesInPath('./src/app', '.ts'), ...getFilesInPath('./src/common', '.ts')];

    let names = [
        ...extractIconNamesFromHtmlFiles(htmlFiles),
        ...extractIconNamesFromTsFiles(tsFiles)
    ];

    //add icons that are not in html files, but should be included
    //TODO: import names from menus php config and GetAnalyticsHeaderData
    names = names.concat([
        'folder-file-custom',
        'pdf-file-custom',
        'audio-file-custom',
        'video-file-custom',
        'text-file-custom',
        'image-file-custom',
        'word-file-custom',
        'archive-file-custom',
        'default-file-custom',
        'spreadsheet-file-custom',
        'shared-folder-file-custom',
        'power-point-file-custom',
        'access-time',
        'view-module',
        'view-list',
        'file-download',
        'storage',
    ]);

    //filter out duplicates from icon names
    return names.reduce(function(accum, current) {
        if (accum.indexOf(current) < 0) accum.push(current);
        return accum;
    }, []);
}

function extractIconNamesFromHtmlFiles(files) {
    let names = [];
    files.forEach(function(path) {
        const contents = fs.readFileSync(path, 'utf8');
        const regex = /svgIcon="(.+?)"/g;

        let matches, output = [];
        while (matches = regex.exec(contents)) {
            output.push(matches[1]);
        }

        names = names.concat(output);
    });

    return names;
}

function extractIconNamesFromTsFiles(files) {
    let names = [];
    files.forEach(function(path) {
        const contents = fs.readFileSync(path, 'utf8');
        const regex = /icon: '(.+?)'/g;

        let matches, output = [];
        while (matches = regex.exec(contents)) {
            output.push(matches[1]);
        }

        names = names.concat(output);
    });

    return names;
}

/**
 * Get a list of all files with matching extension is specified directory.
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
