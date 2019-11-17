module.exports = [{
  name: () => 'README.md',
  content: ({ moduleName, name }) =>
    `# ${moduleName}

## Getting started

\`$ npm install ${moduleName} --save\`

### Mostly automatic installation

\`$ react-native link ${moduleName}\`

## Usage
\`\`\`javascript
import ${name} from '${moduleName}';

// TODO: What to do with the module?
${name};
\`\`\`
`,
}, {
  name: () => 'package.json',
  content: ({ moduleName, platforms, githubAccount, authorName, authorEmail, license }) => {
    const withWindows = platforms.indexOf('windows') >= 0;

    const peerDependencies =
      `{
    "react": "^16.8.1",
    "react-native": ">=0.59.0-rc.0 <1.0.x"` +
      (withWindows
        ? `,
    "react-native-windows": ">=0.59.0-rc.0 <1.0.x"`
        : ``) + `
  }`;

    const devDependencies =
      `{
    "react": "^16.8.3",
    "react-native": "^0.59.10"` +
        (withWindows
          ? `,
    "react-native-windows": "^0.59.0-rc.1"`
          : ``) + `
  }`;

    return `{
  "name": "${moduleName}",
  "title": "${moduleName.split('-').map(word => word[0].toUpperCase() + word.substr(1)).join(' ')}",
  "version": "1.0.0",
  "description": "TODO",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/${githubAccount}/${moduleName}.git",
    "baseUrl": "https://github.com/${githubAccount}/${moduleName}"
  },
  "keywords": [
    "react-native"
  ],
  "author": {
    "name": "${authorName}",
    "email": "${authorEmail}"
  },
  "license": "${license}",
  "licenseFilename": "LICENSE",
  "readmeFilename": "README.md",
  "peerDependencies": ${peerDependencies},
  "devDependencies": ${devDependencies}
}
`;
  },
}, {
  // for module without view:
  name: ({ view }) => !view && 'index.js',
  content: ({ name }) =>
    `import { NativeModules } from 'react-native';

const { ${name} } = NativeModules;

export default ${name};
`,
}, {
  // for module with view:
  name: ({ view }) => view && 'index.js',
  content: ({ name }) =>
    `import { requireNativeComponent } from 'react-native';

const ${name} = requireNativeComponent('${name}', null);

export default ${name};
`,
}, {
  name: () => '.gitignore',
  content: ({ platforms }) => {
    return `# OSX
#
.DS_Store

# node.js
#
node_modules/
npm-debug.log
yarn-error.log

# Xcode
#
build/
*.pbxuser
!default.pbxuser
*.mode1v3
!default.mode1v3
*.mode2v3
!default.mode2v3
*.perspectivev3
!default.perspectivev3
xcuserdata
*.xccheckout
*.moved-aside
DerivedData
*.hmap
*.ipa
*.xcuserstate
project.xcworkspace

# Android/IntelliJ
#
build/
.idea
.gradle
local.properties
*.iml

# BUCK
buck-out/
\\.buckd/
*.keystore
`;
  },
}, {
  name: () => '.gitattributes',
  content: ({ platforms }) => {
    return '*.pbxproj -text\n';
  }
}, {
  name: () => '.npmignore',
  content: ({ generateExample, exampleName }) => {
    if (generateExample) {
      return `${exampleName}\n`;
    }

    return '';
  }
}];
