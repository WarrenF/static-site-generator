import path from 'path'
import Metalsmith from 'metalsmith'
import markdown from 'metalsmith-markdown'
import template from 'metalsmith-react-tpl'
import assets from 'metalsmith-assets-improved'
import { BuildConfig } from './types'
import getDataSource from './getDataSource'

// import getPrismicContent from './getPrismicContent'
// import singleFileOnly from './singleFileOnly'

import webpackPages from './webpackPages'

const MetalSmithLoader = async (opts: BuildConfig) => {

  if (!opts.dataSource) throw new Error('No dataSource param provided for the content endpoint')
  if (!opts.src) throw new Error('No src param provided for the .md file directory')
  if (!opts.templateDir) throw new Error('No templateDir param provided for the template directory')
  if (!opts.layoutDir) throw new Error('No layoutDir param provided for the layouts directory')
  if (!opts.destination) throw new Error('No destination param provided for the output directory')
  if (!opts.assets) throw new Error('No assets param provided for the assets directory')
  if (!opts.webpack) throw new Error('No option for webpack has been passed')

  if (opts.devMode) opts.config = Object.assign({}, opts.config, { devMode: true })
  opts.clean = opts.clean ? opts.clean : false

  const dataSource = getDataSource(opts)

  const metalSmith = Metalsmith(opts.src)
    .clean(opts.clean)
    .metadata(opts.config || { })
    .use(dataSource)

  /*
  if (opts.dataSource && opts.dataSource.type === 'prismic') {
    metalSmith.use(getPrismicContent())
  }
  */

  metalSmith
    .use(markdown())
    .use(template({
      babel: true,
      noConflict: false,
      isStatic: opts.renderToStatic ? opts.renderToStatic : false,
      baseFile: 'layout.jsx',
      baseFileDirectory: opts.layoutDir,
      directory: opts.templateDir
    }))
    .destination(opts.destination)
    .use(assets({
      src: './' + opts.assets,
      dest: './'
    }))
    .use(await webpackPages({
      directory: opts.templateDir,
      options: opts.webpackOptions,
      noConflict: false,
      dest: opts.destination + '/js',
      webpack: require(path.join(opts.src, opts.webpack)),
      webpackCallback: opts.webpackCallback
    }))

  if (opts.markDownSource) {
    metalSmith.source(opts.markDownSource)
  }

  metalSmith.build((err: any) => {
    if (err) throw err
    if (opts.callback) return opts.callback()
  })
}

export default MetalSmithLoader
