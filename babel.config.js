module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@api': './src/api',
            '@components': './src/components',
            '@configs': './src/configs',
            '@features': './src/features',
            '@hooks': './src/hooks',
            '@navigation': './src/navigation',
            '@store': './src/store',
            '@utils': './src/utils',
            '@assets': './src/assets',
            '@types': './src/@types',
          },
        },
      ],
    ],
  };
};
