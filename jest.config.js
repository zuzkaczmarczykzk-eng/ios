const path = require('path');

const babelConfig = path.resolve(__dirname, 'babel.config.js');

module.exports = {
  preset: 'jest-expo',
  transform: {
    '\\.[jt]sx?$': [
      require.resolve('babel-jest'),
      { configFile: babelConfig },
    ],
  },
  setupFiles: ['./jest.setup.js'],
  setupFilesAfterEnv: ['./jest.setup-after.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.claude/'],
  modulePathIgnorePatterns: ['/.claude/'],
};
