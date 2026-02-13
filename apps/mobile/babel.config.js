module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'babel-plugin-transform-define',
        {
          'process.env.EXPO_ROUTER_APP_ROOT': './app',
        },
      ],
    ],
  };
};