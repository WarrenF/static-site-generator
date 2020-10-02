const presets = [
  '@babel/react',
  '@babel/typescript',
  ['@babel/env', {
    targets: {
      'browsers': [
        'ie >= 11',
        'last 2 iOS major versions',
        'last 2 Firefox major versions',
        'last 2 Safari major versions',
        'last 2 Chrome major versions'
      ]
    },
    useBuiltIns: 'usage',
    corejs: 2
  }]
]

const plugins = [
  '@babel/proposal-class-properties',
  '@babel/proposal-object-rest-spread'
]

module.exports = { presets, plugins }
