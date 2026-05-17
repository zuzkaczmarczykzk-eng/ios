module.exports = function (api) {
  const isTest = api.env('test');
  api.cache.using(() => process.env.NODE_ENV);

  if (isTest) {
    return {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' }, modules: 'commonjs' }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        'babel-preset-expo',
      ],
    };
  }

  return {
    presets: ['babel-preset-expo'],
  };
};
