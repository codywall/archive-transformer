# News article transformer

## Overview

This is a NodeJS application for converting news article database entries into static HTML files. Moving from a database to static HTML files hosted on Github allows CSUMB to keep a copy of their archived news articles without the need to pay for a database service, and allows for a much more stable platform.

## How to run
To run this application and create the HTML files, clone the repo, run `npm i`, and run `node index`. 

The JSON file from pages.json is read and turned into individual HTML files. These files will then be moved to a static website where they will exist as cold storage.
 
