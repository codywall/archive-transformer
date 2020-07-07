'use strict';
const fs = require('fs');
const walkPath = './pages';
const cheerio = require('cheerio');
const matter = require('gray-matter');
let pageCounter = 0;
let modifiedCounter = 0;

const walk = function (dir, done) {
  fs.readdir(dir, function (error, list) {
    list = list.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item));
    if (error) {
      return done(error);
    }
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) {
        return done(null);
      }

      file = dir + '/' + file;
      fs.stat(file, function (error, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function (error) {
            next();
          });
        } else {
          // modify file here
          // read the file
          let data = fs.readFileSync(file, 'utf-8');

          // edit frontmatter
          let frontMatter = matter(data);
          delete frontMatter.data['layout'];
          frontMatter.data['title'] = frontMatter.data['title'].replace(
            /,/g,
            ''
          );
          frontMatter.data.slug = frontMatter.data.title
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/,/g, '');
          data = matter.stringify(frontMatter, frontMatter.data);
          console.log(data);

          const $ = cheerio.load(data, {
            // stop cheerio from adding head and body tags
            xmlMode: true,
          });
          // remove meta divs
          let $metaDiv = $('div.meta').first();
          $metaDiv.find('*').remove();
          $metaDiv.remove();
          // remove content divs
          let contents = $('.node').contents();
          $('.node').replaceWith(contents);
          contents = $('.node-inner').contents();
          $('.node-inner').replaceWith(contents);
          // turn date into a span
          $('.news-byline').replaceWith(
            `<span class="date">${$('.news-byline').html()}</span>`
          );
          // remove content div
          contents = $('.content').contents();
          $('.content').replaceWith(contents);
          // strip comments
          $.root()
            .contents()
            .filter(function () {
              return this.type === 'comment';
            })
            .remove();
          //write updated file
          fs.writeFileSync(file, $.html(), function (err) {
            if (err) {
              throw err;
            }
            modifiedCounter++;
          });
        }
        pageCounter++;
        next();
      });
    })();
  });
};

console.log('-------------------------------------------------------------');
console.log('processing...');
console.log('-------------------------------------------------------------');

walk(walkPath, function (error) {
  if (error) {
    throw error;
  } else {
    console.log(
      '-------------------------------------------------------------'
    );
    console.log(
      `Transformation finished. ${pageCounter} pages read and ${modifiedCounter} pages transformed.`
    );
    console.log(
      '-------------------------------------------------------------'
    );
  }
});
