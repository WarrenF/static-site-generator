"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _metalsmith = _interopRequireDefault(require("metalsmith"));

var _metalsmithMarkdown = _interopRequireDefault(require("metalsmith-markdown"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import path from 'path'
// import getDataSource from './getDataSource'
// import getPrismicContent from './getPrismicContent'
// import singleFileOnly from './singleFileOnly'
// import webpackPages from './webpackPages'
var MetalSmithLoader = function MetalSmithLoader(opts) {
  // TODO: Add in datasources
  // if (!opts.dataSource) throw new Error('No dataSource param provided for the content endpoint')

  /*
  let isStatic = true
  if (!opts.src) throw new Error('No src param provided for the .md file directory')
  if (!opts.templateDir) throw new Error('No templateDir param provided for the template directory')
  if (!opts.layoutDir) throw new Error('No layoutDir param provided for the layouts directory')
  if (!opts.destination) throw new Error('No destination param provided for the output directory')
  if (!opts.assets) throw new Error('No assets param provided for the assets directory')
  if (!opts.webpack) throw new Error('No option for webpack has been passed')
  if (opts.showReactIDs) isStatic = false
  if (opts.devMode) {
    opts.config = Object.assign({}, opts.config, { devMode: true })
  }
  */
  opts.clean = opts.clean ? opts.clean : false; // const dataSource = getDataSource(opts)

  var metalSmith = (0, _metalsmith.default)(opts.src).clean(opts.clean).metadata(opts.config || {}); // .use(dataSource)

  /*
  if (opts.dataSource && opts.dataSource.type === 'prismic') {
    metalSmith.use(getPrismicContent())
  }
  */

  metalSmith.use((0, _metalsmithMarkdown.default)())
  /*.use(template({
    babel: true,
    noConflict: false,
    isStatic,
    baseFile: 'layout.jsx',
    baseFileDirectory: opts.layoutDir,
    directory: opts.templateDir
  }))*/
  .destination(opts.destination);
  /*.use(assets({
    src: './' + opts.assets,
    dest: './'
  }))
  .use(webpackPages({
    directory: opts.templateDir,
    options: opts.webpackOptions,
    noConflict: false,
    dest: opts.destination + '/js',
    webpack: require(path.join(opts.src, opts.webpack)),
    callback: opts.callback
  }))
  */

  if (opts.markDownSource) {
    metalSmith.source(opts.markDownSource);
  }

  metalSmith.build(function (err) {
    if (err && opts.callback) return opts.callback(err);
    if (err) throw err;
  });
};

var _default = MetalSmithLoader;
exports.default = _default;