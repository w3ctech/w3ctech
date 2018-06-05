module.exports = {
  'presets': [
    [
      '@babel/preset-env',
      {
        'targets': {
          'node': 'current'
        },
        'shippedProposals': true
      }
    ]
  ],
  'plugins': [
    [
      '@babel/plugin-transform-runtime', {
        'helpers': true,
        'polyfill': true,
        'regenerator': true,
        'moduleName': '@babel/runtime',
        'useBuiltIns': false,
        'useESModules': false
      }
    ],
    ['@babel/plugin-proposal-class-properties', { 'loose': true }],
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-proposal-object-rest-spread'
  ],
  'comments': false
};
