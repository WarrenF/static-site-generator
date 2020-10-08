import deepmerge from 'deepmerge'
import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'
import rm from 'rimraf'
import webpack from 'webpack'
import { Page, WebpackGenerateOutputOptions } from './types'

let outputFiles = { }

const webpackPages = async (globalOptions: any) => {
  return (files: { [key: string]: Page }, metalsmith: any, done: any) => {
    done()
    if (!globalOptions.webpack || !globalOptions.dest || !globalOptions.directory) return

    globalOptions.tempDir = path.join(metalsmith._directory, '_tempOutput')
    globalOptions.dest = path.join(metalsmith._directory, globalOptions.dest)

    const generateOutput = (template: string, props: any, options: WebpackGenerateOutputOptions) => {
      const method = 'hydrate'
      const templateGroups = metalsmith._directory.split('/templates')
      const templateGroup = templateGroups.length > 1 ? '/templates' + templateGroups[1] : (props.group || '')

      const output = `
        var React = require( 'react' );
        var ReactDOM = require( 'react-dom' );
        var Element = require( '${template}' );
        window.ReactRoot = Element;
        if ( typeof Element.default === 'function' ) Element = Element.default;
        var props = ${JSON.stringify(props)};
        window.ReactRootProps = props;
        window.SSGTemplateGroup = '${templateGroup}';
        var renderedElement = ReactDOM.${method}( <Element {...props} />, document.getElementById( 'content' ));
      `

      const destFilename = options.destFilename
      const filename = path.join(options.tempDir, destFilename)
      outputFiles[ destFilename.replace('.js', '') ] = filename

      return new Promise((resolve, reject) => {
        mkdirp(path.dirname(filename)).then(() => {
          return fs.writeFile(filename, output, (err) => {
            if (err) return reject(err)
            return resolve('done')
          })
        }).catch((err: Error) => reject(err))
      })
    }

    const iterator = (prop: Page, file: string) => {
      const props: any = deepmerge({ }, prop, metalsmith._metadata)
      props.tpl = (globalOptions.noConflict) ? 'rtemplate' : 'template'
      if (!props[ props.tpl ]) return false
      delete props.contents
      delete props.stats
      delete props.mode
      const template = path.join(metalsmith._directory, globalOptions.directory, props[ props.tpl ])
      globalOptions.destFilename = file.replace(path.extname(file), '') + '.js'
      return generateOutput(template, props, globalOptions)
    }

    const finishAll = (): void => {
      if (typeof globalOptions.webpack === 'function') globalOptions.webpack = globalOptions.webpack(globalOptions)
      if (!outputFiles || Object.keys(outputFiles).length < 1) {
        rm(path.join(metalsmith._directory, '_tempOutput'), () => { /*Do nothing*/ })
        const webpackError = 'No outputFiles for webpack'
        console.log(webpackError)
        if (globalOptions.webpackCallback) return globalOptions.webpackCallback(new Error(webpackError))
      }
      globalOptions.webpack.entry = outputFiles
      webpack(globalOptions.webpack, (err: any, stats) => {
        if (err) {
          if (err.details) console.log(err.details)
          if (globalOptions.webpackCallback) return globalOptions.webpackCallback(err)
          throw err
        }
        const info = stats.toJson()
        if (stats.hasErrors()) console.log(info.errors)
        rm(path.join(metalsmith._directory, '_tempOutput'), () => { /*Do nothing*/ })
        if (globalOptions.webpackCallback) return globalOptions.webpackCallback(null, Object.keys(outputFiles))
      })
    }

    outputFiles = { }
    const promises = Object.keys(files).map(function (key) {
      const props = files[key]
      const file = key
      return iterator(props, file)
    })

    // Call the chain
    return Promise
      .all(promises)
      .then(finishAll)
      .catch(function (err) {
        if (globalOptions.webpackCallback) return globalOptions.webpackCallback(err)
        console.error(err)
      })
  }
}

export default webpackPages
