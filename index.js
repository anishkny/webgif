#!/usr/bin/env node

const fs = require('fs');
const GIFEncoder = require('gifencoder');
const pngFileStream = require('png-file-stream');
const puppeteer = require('puppeteer');
const tempdir = require('tempdir');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const workdir = await tempdir();
  let outdir = process.cwd();

  page.setViewport({
    width: 1024,
    height: 768,
  });

  process.stdout.write('Taking screenshots: .');
  screenshotTaker = setInterval(() => {
    if (page) {
      filename = `${workdir}/T${new Date().getTime()}.png`;
      process.stdout.write('.');
      page.screenshot({ path: filename, });
    }
  }, 1000);

  await page.goto('https://giphy.com/search/lol');
  await delay(10000);
  clearInterval(screenshotTaker);
  await delay(2000);
  await page.close();
  await browser.close();

  // Check if outdir is writeable, else fallback to workdir
  try {
    fs.accessSync(outdir, fs.constants.W_OK);
  } catch (err) {
    console.warn(`Output folder is not writeable: [${outdir}], falling back to: [${workdir}]`);
    outdir = workdir;
  }

  console.log(`\nEncoding GIF: ${outdir}/web.gif`);
  const encoder = new GIFEncoder(1024, 768);
  await pngFileStream(`${workdir}/T*png`)
    .pipe(encoder.createWriteStream({ repeat: 0, delay: 200, quality: 20 }))
    .pipe(fs.createWriteStream(`${outdir}/web.gif`));
  console.log('Done!');
})();


function delay(time) {
  return new Promise(function(fulfill) {
    setTimeout(fulfill, time);
  });
}
