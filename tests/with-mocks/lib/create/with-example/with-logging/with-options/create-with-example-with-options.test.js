const lib = require('../../../../../../../lib/lib.js');

// special compact mocks for this test:
const mysnap = [];
const mockpushit = x => mysnap.push(x);
jest.mock('fs-extra', () => ({
  outputFile: (outputFileName, theContent) => {
    mockpushit({
      outputFileName: outputFileName.replace(/\\/g, '/'),
      theContent
    });
    return Promise.resolve();
  },
  ensureDir: (dir) => {
    mockpushit({ ensureDir: dir.replace(/\\/g, '/') });
    return Promise.resolve();
  },
  readFile: (path, _, cb) => {
    mockpushit({ readFileSyncFromPath: path.replace(/\\/g, '/') });
    cb(null, `{ "name": "x", "scripts": { "test": "exit 1" } }`);
  },
  writeFile: (path, json, options, cb) => {
    mockpushit({
      writeFileToPath: path.replace(/\\/g, '/'),
      json,
      options
    });
    cb();
  },
}));
jest.mock('execa', () => ({
  command: (command, options) => {
    mockpushit({ command: command, options });
    return Promise.resolve();
  }
}));

// TBD hackish mock:
global.console = {
  info: (...args) => {
    mockpushit({ info: [].concat(args) });
  },
  log: (...args) => {
    mockpushit({ log: [].concat(args) });
  },
  warn: (...args) => {
    mockpushit({ warn: [].concat(args) });
  },
};

test('create alice-bobbi module using mocked lib with logging, with example, for Android & iOS with config options', async () => {
  const options = {
    platforms: ['android', 'ios'],
    name: 'alice-bobbi',
    prefix: 'ABC',
    packageIdentifier: 'com.alicebits',
    githubAccount: 'alicebits',
    authorName: 'Alice',
    authorEmail: 'contact@alice.me',
    license: 'ISC',
    generateExample: true,
  };

  await lib(options);

  expect(mysnap).toMatchSnapshot();
});
