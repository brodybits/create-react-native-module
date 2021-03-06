const lib = require('../../../../../../../lib/lib.js');

const mockcwd = require('process').cwd();

// special compact mocks for this test:
const mysnap = [];
const mockpushit = x => mysnap.push(x);
jest.mock('fs-extra', () => ({
  outputFile: (outputFileName, theContent) => {
    mockpushit({
      outputFileName: outputFileName.replace(mockcwd, '...').replace(/\\/g, '/'),
      theContent
    });
    return Promise.resolve();
  },
  ensureDir: (dir) => {
    mockpushit({ ensureDir: dir.replace(mockcwd, '...').replace(/\\/g, '/') });
    return Promise.resolve();
  },
  readFileSync: (path) => {
    mockpushit({ readFileSyncFromPath: path.replace(mockcwd, '...').replace(/\\/g, '/') });
    return `{ "name": "x", "scripts": { "test": "exit 1" } }`;
  },
  writeFileSync: (path, json, options) => {
    mockpushit({
      writeFileSyncToPath: path.replace(mockcwd, '...').replace(/\\/g, '/'),
      json,
      options
    });
  },
}));
jest.mock('execa', () => ({
  commandSync: (command, opts) => {
    const options = { ...opts, ...(opts.cwd ? { cwd: opts.cwd.replace(mockcwd, '...').replace(/\\/g, '/') } : {}) };
    mockpushit({ commandSync: command, options });
  }
}));
jest.mock('react-native-init-func', () => (projectNameArray, opts) => {
  const options = { ...opts, ...(opts.directory ? { directory: opts.directory.replace(/\\/g, '/') } : {}) };
  mockpushit({ call: 'reactNativeInit', nameArray: projectNameArray, options });
});
jest.mock('console', () => ({
  info: (...args) => {
    mockpushit({
      info: args.map(line => line.replace(mockcwd, '...').replace(/\\/g, '/'))
    });
  },
  log: (...args) => {
    mockpushit({ log: [].concat(args) });
  },
  warn: (...args) => {
    mockpushit({ warn: [].concat(args) });
  },
  error: (...args) => {
    mockpushit({ error: [].concat(args) });
  },
}));

test('create alice-bobbi module using mocked lib with logging, with example, for Android & iOS with config options including `exampleFileLinkage: true`', async () => {
  const options = {
    platforms: ['android', 'ios'],
    name: 'alice-bobbi',
    nativePackageId: 'com.alicebits',
    tvosEnabled: true,
    githubAccount: 'alicebits',
    authorName: 'Alice',
    authorEmail: 'contact@alice.me',
    license: 'ISC',
    generateExample: true,
    exampleFileLinkage: true,
    exampleName: 'demo',
    exampleReactNativeTemplate: 'react-native@npm:react-native-tvos'
  };

  await lib(options);

  expect(mysnap).toMatchSnapshot();
});
