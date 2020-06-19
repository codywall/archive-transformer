'use strict';
const fs = require('fs');

let rawData = fs.readFileSync('pages.json');
let pages = JSON.parse(rawData).pages;
let htmlContent = [];
// for (let i = 0; i < pages.length; i++) {
let content = JSON.parse(pages[0].node.pageContent);
let values = Object.values(content.blocks);
let title = pages[0].node.title;
let fileName = title.replace(/\s+/g, '-').toLowerCase();

for (let j = 0; j < values.length; j++) {
  if (values[j].type == 'heading') {
    let header = values[j].data.url
      ? `<h${values[j].data.level}><a href='${values[j].data.url}'>${values[j].data.text}</a></h${values[i].data.level}>`
      : `<h${values[j].data.level}>${values[j].data.text}</h${values[j].data.level}>`;

    htmlContent.push(header);
  }
  if (values[j].type == 'text') {
    let text = `<p>${values[j].data.text}</p>`;
    htmlContent.push(text);
  }
}
let htmlBlock = `---
layout: archive
title: ${title}
date: 
---
<!--googleon: snippet-->
<div class="node node-type-news">
<div class="node-inner">
<div class="content">
${htmlContent.join('')}
</div>
</div>
`;
console.log(htmlBlock);

//create file
fs.writeFileSync(`pages/${fileName}.html`, htmlBlock, (err) => {
  console.log(err);
});

// }
