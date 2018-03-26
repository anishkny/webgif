<p align="center"><img src="logo.svg"></p>

# **webgif** - *Easily generate animated GIFs from websites*

[![Build Status](https://travis-ci.org/anishkny/webgif.svg?branch=master)](https://travis-ci.org/anishkny/webgif)
[![Build status](https://ci.appveyor.com/api/projects/status/ji5c66ex9ifog9hk/branch/master?svg=true)](https://ci.appveyor.com/project/anishkny/webgif/branch/master)
[![NPM Version](https://img.shields.io/npm/v/webgif.svg)](https://www.npmjs.com/package/webgif)

* **Easy**            :point_right:  *Just point it to a URL and get an animated GIF!*
* **Cross-platform**  :point_right:  *Works on Windows, Mac, Linux, without Docker!*
* **Headless**        :point_right:  *Uses [GoogleChrome/puppeteer](https://github.com/GoogleChrome/puppeteer)*
* **Inspired**        :point_right:  *By [asciicast2gif](https://github.com/asciinema/asciicast2gif) and wanting to make it easier to use*

## Installation
```bash
yarn global add webgif || npm i -g webgif
```

## Usage

To navigate to `https://giphy.com/search/lol` and make an animated GIF of duration `10` seconds, execute:

```bash
webgif -u https://giphy.com/search/lol -d 10

Navigating to URL: https://giphy.com/search/lol
Taking screenshots: .............
Encoding GIF: /home/user/web.gif
```

## Options

```bash
webgif -u URL -d DURATION [-o OUTFILE]

Options:
  --url, -u       URL to generate GIF from
                                       [default: "https://giphy.com/search/lol"]
  --duration, -d  GIF duration in seconds                          [default: 10]
  --output, -o    Output file name
                             [default: "web.gif"]
  -h, --help      Show help                                            [boolean]
  -V, --version   Show version number                                  [boolean]
```

## Sample GIF

![Sample GIF](https://storage.googleapis.com/webgif/web.gif)

## How it works

1. Use [Puppeteer](https://github.com/GoogleChrome/puppeteer) to launch a headless Chrome window
1. Use `setInterval` to take screenshots and save them to disk
1. Navigate to target URL and wait for specified duration
1. Use [gifencoder](https://github.com/eugeneware/gifencoder) and [png-file-stream](https://github.com/eugeneware/png-file-stream) to create animated GIF out of saved screenshots

See code: [`index.js`](index.js)
