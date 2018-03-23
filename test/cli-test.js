const assert = require('assert');
const shell = require('shelljs');
const tempdir = require('tempdir');

const origdir = process.cwd();

describe('CLI tests', async () => {

  before(async () => {
    shell.config.verbose = true;
    console.log(`Original dir: [${origdir}]`);
    const workdir = await tempdir();
    shell.cd(workdir);
    console.log(`Changed to: [${process.cwd()}]`);
  });

  it('should install npm package', async () => {
    shell.exec(`npm install --silent yarn`);
    shell.exec(`npx yarn add 'file:${origdir}'`);
    const runoutput = shell.exec(`npx yarn run webgif`);
    assert(runoutput.code === 0, runoutput)
  });

});
