module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@/app': './src/app',
            '@/features': './src/features',
            '@/shared': './src/shared',
            '@/assets': './src/assets',
            '@theme': './src/shared/theme',
            '@atoms': './src/shared/ui/atoms',
            '@molecules': './src/shared/ui',
            '@organisms': './src/shared/ui',
            '@hooks': './src/shared/hooks',
            '@utils': './src/shared/utils',
          },
        },
      ],
    ],
  };
};
