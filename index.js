#!/usr/bin/env node

const fs = require('fs');
const GIFEncoder = require('gifencoder');
const pngFileStream = require('png-file-stream');
const puppeteer = require('puppeteer');
const tempdir = require('tempdir');

const encoder = new GIFEncoder(1024, 768);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const workdir = await tempdir();

  page.setViewport({
    width: 1024,
    height: 768,
  });

  process.stdout.write('Taking screenshots: .');
  screenshotTaker = setInterval(async () => {
    if (page) {
      filename = `${workdir}/T${new Date().getTime()}.png`;
      process.stdout.write('.');
      await page.screenshot({
        path: filename,
      });
    }
  }, 1000);

  await page.goto('https://giphy.com/search/lol');
  await delay(10000);
  clearInterval(screenshotTaker);
  await delay(2000);
  await page.close();
  await browser.close();

  console.log('\nEncoding GIF: ');
  await pngFileStream(`${workdir}/T*png`)
    .pipe(encoder.createWriteStream({ repeat: 0, delay: 200, quality: 20 }))
    .pipe(fs.createWriteStream(`${workdir}/recording.gif`));
  console.log(`\n${workdir}/recording.gif`);
})();


function delay(time) {
  return new Promise(function(fulfill) {
    setTimeout(fulfill, time);
  });
}
