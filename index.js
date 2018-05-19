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
  await page.goto(argv.url);

  process.stdout.write('Taking screenshots: .');
  const screenshotPromises = [];
  for (let i = 1; i <= argv.duration; ++i) {
    filename = `${workdir}/T${new Date().getTime()}.png`;
    process.stdout.write('.');
    screenshotPromises.push(page.screenshot({ path: filename, }));
    await delay(1000);
  }

  await delay(1000);
  await Promise.all(screenshotPromises);
  console.log(`\nEncoding GIF: ${argv.output}`);
  const encoder = new GIFEncoder(1024, 768);
  await pngFileStream(`${workdir}/T*png`)
    .pipe(encoder.createWriteStream({ repeat: 0, delay: 200, quality: 20 }))
    .pipe(fs.createWriteStream(`${argv.output}`));
  await page.close();
  await browser.close();

})();

process.on('unhandledRejection', function(reason, p) {
  throw new Error(reason);
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
