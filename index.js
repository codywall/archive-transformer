'use strict';
const fs = require('fs');

let rawData = fs.readFileSync('pages.json');
let pages = JSON.parse(rawData).pages;
let htmlContent = [];
let pageCounter = 0;
for (let i = 0; i < pages.length; i++) {
  htmlContent = [];
  let content = JSON.parse(pages[i].node.pageContent);
  let values = Object.values(content.blocks);
  let title = pages[i].node.title;
  let fileName = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
  let slug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');

  for (let j = 0; j < values.length; j++) {
    if (values[j].type == 'heading') {
      let header = values[j].data.url
        ? `<h${values[j].data.level}><a href='${values[j].data.url}'>${values[j].data.text}</a></h${values[j].data.level}>`
        : `<h${values[j].data.level}>${values[j].data.text}</h${values[j].data.level}>`;

      htmlContent.push(header);
    }
    if (values[j].type == 'text') {
      let text = `<p>${values[j].data.text}</p>`;
      htmlContent.push(text);
    }
    // if (values[j].type == 'image') {
    //   imageCounter++;
    //   let img = `<img src='${values[j].data.image.url}' alt='${values[j].data.description}'/>`;
    //   console.log(img);
    //   htmlContent.push(img);
    // }
  }
  let htmlBlock = `---
slug: ${slug}
title: "${title}"
date: January 01 2020
---

${htmlContent.join('')}
`;

  //   create files
  fs.writeFileSync(`pages/${fileName}.md`, htmlBlock, (err) => {
    console.log(err);
    pageCounter++;
  });
}
console.log(`Built ${pageCounter} pages.`);
