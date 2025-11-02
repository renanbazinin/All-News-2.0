// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Set the public path for web builds to include the GitHub Pages subdirectory
config.transformer = {
  ...config.transformer,
  publicPath: '/All-News-2.0/',
};

module.exports = config;
