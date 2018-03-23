const assert = require('assert');
const shell = require('shelljs');
const tempdir = require('tempdir');

describe('CLI tests', async () => {

  before(async () => {
    shell.config.verbose = true;
  });

  it('should run webgif', async () => {
    const runoutput = shell.exec(`node index.js`);
    assert(runoutput.code === 0, runoutput);
  });

});
