const assert = require('assert');
const shell = require('shelljs');
const tempdir = require('tempdir');

shell.config.verbose = true;

describe('CLI tests', async () => {

  it('default options', async () => {
    assertShellOutput('node index.js');
  });

  it('help, version', async () => {
    assertShellOutput('node index.js -h');
    assertShellOutput('node index.js -V');
  });

  it('other options', async () => {
    assertShellOutput('node index.js -u http://google.com');
    assertShellOutput('node index.js -d 5');
  });

});

function assertShellOutput(cmd) {
  const runoutput = shell.exec(cmd);
  assert(runoutput.code === 0, runoutput);
}
