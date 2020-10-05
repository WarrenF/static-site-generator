const presets = [
  '@babel/typescript',
  ['@babel/env', { modules: false }]
]

const plugins = [
  '@babel/proposal-class-properties',
  '@babel/proposal-object-rest-spread'
]

module.exports = { presets, plugins }
