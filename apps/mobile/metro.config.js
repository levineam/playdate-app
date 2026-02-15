// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

// Set the EXPO_ROUTER_APP_ROOT environment variable
process.env.EXPO_ROUTER_APP_ROOT = './app';

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Force JavaScript Core instead of Hermes
config.transformer = {
  ...config.transformer,
  hermesParser: false,
};

module.exports = config;