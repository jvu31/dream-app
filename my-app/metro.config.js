const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });

/** @type {import('expo/metro-config').MetroConfig} */
config.resolver.sourceExts.push('sql');
module.exports = config;

