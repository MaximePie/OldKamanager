const path = require("path")

module.exports = {
  rootDir: ".",
  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: [
    'node_modules',
    './tests',
  ],
  transform: {},
  testEnvironment: 'jest-environment-node',
}