module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
<<<<<<< HEAD
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
      }],
      'react-native-reanimated/plugin',
    ],
=======
>>>>>>> ce05d2edea089de25d71584dcb8be55e5f57943e
  };
};
