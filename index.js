'use strict';
const fs = require('fs');
const walkPath = './pages';
let pageCounter = 0;

const walk = function (dir, done) {
  fs.readdir(dir, function (error, list) {
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
          // do stuff to file here
          let data = fs.readFileSync(file, 'utf-8');
          if (pageCounter < 5) {
            console.log(data);
          }
          pageCounter++;
          next();
        }
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
    console.log(`finished. ${pageCounter} pages read.`);
    console.log(
      '-------------------------------------------------------------'
    );
  }
});

// let pages = fs.readdir();
// let rawData = fs.readFileSync(page);
// let htmlContent = [];
// let pageCounter = 0;
// for (let i = 0; i < pages.length; i++) {
//   let content = JSON.parse(pages[i].node.pageContent);
//   let values = Object.values(content.blocks);
//   let title = pages[i].node.title;
//   let fileName = title
//     .toLowerCase()
//     .replace(/\s+/g, '-')
//     .replace(/[^\w-]+/g, '');

//   for (let j = 0; j < values.length; j++) {
//     if (values[j].type == 'heading') {
//       let header = values[j].data.url
//         ? `<h${values[j].data.level}><a href='${values[j].data.url}'>${values[j].data.text}</a></h${values[j].data.level}>`
//         : `<h${values[j].data.level}>${values[j].data.text}</h${values[j].data.level}>`;

//       htmlContent.push(header);
//     }
//     if (values[j].type == 'text') {
//       let text = `<p>${values[j].data.text}</p>`;
//       htmlContent.push(text);
//     }
//     // if (values[j].type == 'image') {
//     //   imageCounter++;
//     //   let img = `<img src='${values[j].data.image.url}' alt='${values[j].data.description}'/>`;
//     //   console.log(img);
//     //   htmlContent.push(img);
//     // }
//   }
//   let htmlBlock = `---
// layout: archive
// title: ${title}
// date: January 01 2020
// ---
// <!--googleon: snippet-->
// <div class="node node-type-news">
// <div class="node-inner">
// <div class="content">
// ${htmlContent.join('')}
// </div>
// </div>
// `;

//   //   create files
//   fs.writeFileSync(`pages/${fileName}.html`, htmlBlock, (err) => {
//     console.log(err);
//     pageCounter++;
//   });
// }
// console.log(`Built ${pageCounter} pages.`);
