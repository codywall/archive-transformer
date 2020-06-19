'use strict';

const fs = require('fs');

let rawData = fs.readFileSync('pages.json');

// fs.writeFileSync('file.json', pages, (err) => {
//   console.log(err);
// });

let pages = JSON.parse(rawData).pages;
let htmlContent = [];
let content = JSON.parse(pages[0].node.pageContent);
console.log(content);
let values = Object.values(content.blocks);
console.log(values);
console.log(values[0].type);
for (let i = 0; i < values.length; i++) {
  if (values[i].type == 'heading') {
    let header = values[i].data.url
      ? `<h${values[i].data.level}><a href='${values[i].data.url}'>${values[i].data.text}</a></h${values[i].data.level}>`
      : `<h${values[i].data.level}>${values[i].data.text}</h${values[i].data.level}>`;

    htmlContent.push(header);
  }
  if (values[i].type == 'text') {
    let text = `<p>${values[i].data.text}</p>`;
    htmlContent.push(text);
  }
}
let htmlBlock = htmlContent.join('');
console.log(htmlBlock);
