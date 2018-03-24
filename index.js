#!/usr/bin/env node

const fs = require('fs');
const GIFEncoder = require('gifencoder');
const path = require('path');
const pngFileStream = require('png-file-stream');
const puppeteer = require('puppeteer');
const tempdir = require('tempdir');

const argv = require('yargs')
  .alias('url', 'u').default('url', 'https://giphy.com/search/lol')
  .describe('url', 'URL to generate GIF from')
  .alias('duration', 'd').default('duration', 10)
  .describe('duration', 'GIF duration in seconds')
  .alias('output', 'o').default('output', `${process.cwd()}${require('path').sep}web.gif`)
  .describe('output', 'Output file name')
  .alias('h', 'help')
  .alias('V', 'version')
  .usage('webgif -u URL -d DURATION [-o OUTFILE]')
  .version()
  .argv;

(async () => {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: ['--allow-running-insecure-content', '--disable-setuid-sandbox', '--no-sandbox', ],
  });
  const page = await browser.newPage();
  const workdir = await tempdir();

  page.setViewport({
    width: 1024,
    height: 768,
  });

  console.log(`Navigating to URL: ${argv.url}`);
  process.stdout.write('Taking screenshots: .');
  screenshotTaker = setInterval(async () => {
    if (page) {
      filename = `${workdir}/T${new Date().getTime()}.png`;
      process.stdout.write('.');
      await page.screenshot({ path: filename, });
    }
  }, 1000);

  await page.goto(argv.url);
  await delay(argv.duration * 1000);
  clearInterval(screenshotTaker);
  await delay(2000);
  await page.close();
  await browser.close();

  console.log(`\nEncoding GIF: ${argv.output}`);
  const encoder = new GIFEncoder(1024, 768);
  await pngFileStream(`${workdir}/T*png`)
    .pipe(encoder.createWriteStream({ repeat: 0, delay: 200, quality: 20 }))
    .pipe(fs.createWriteStream(`${argv.output}`));
})();


function delay(time) {
  return new Promise(function(fulfill) {
    setTimeout(fulfill, time);
  });
}

process.on('unhandledRejection', function(reason, p) {
  // console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});
