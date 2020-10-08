import path from 'path'
import fs from 'fs'
// import glob from 'glob'
import express from 'express'
import open from 'open'
import chokidar from 'chokidar'
import reload from 'reload'
import directory from 'serve-index'
import { debounce } from 'ts-debounce'

import { BuildConfig } from '../MetalsmithLoader/types'
import { runCommand, create } from '../Scripts'

const app = express()
app.set('port', process.env.PORT || 8080)

type Opts = {
  root: string,
  buildConfig: BuildConfig
}

const DevServer = async (opts: Opts) => {

  // app.use('/favicon.ico', express.static(path.join(opts.root, `build/`)))
  app.use('/js/', express.static(path.join(opts.root, `build/js`)))
  app.use('/css/', express.static(path.join(opts.root, `build/css`)))
  const reloadServer = await reload(app)
  app.use('/*', (req, res, next) => {
    const stat = fs.statSync(path.join(opts.root, 'build', req.params[0] || 'index.html'))
    if (stat && stat.isFile()) res.sendFile(path.join(opts.root, 'build', req.params[0] || 'index.html'))
    else directory(path.join(opts.root, 'build', req.params[0]), { icons: true })(req, res, next)
  })

  const cacheToClear = [
    path.join(opts.root, 'dist'),
    'static-site-generator',
    'metalsmith'
  ]

  const clearCache = () => {
    console.log('clearing cache')
    Object.keys(require.cache).forEach(item => {
      if (!new RegExp('(' + cacheToClear.join('|') + ')').test(item)) return
      delete require.cache[item]
    })
  }

  const watchOpts = {
    ignored: /[/\\]\./,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 500,
      pollInterval: 100
    }
  }
  const watchForChanges = () => {
    // chokidar
    //   .watch(path.join(opts.root, '(src|stylesheets)/**/*.less'), watchOpts)
    //   .on('all', async (event, file) => reBuild(file, '.less', less, 'less'))
    // chokidar
    //   .watch(path.join(opts.root, 'src/**/public/js/**/*.js'), watchOpts)
    //   .on('all', async (event, file) => reBuild(file, '.js', uglifyJS, 'public/js'))

    const websiteTypescriptFiles = path.join(opts.root, 'website/(layouts|store|templates)/**/*.(ts|tsx)')
    const distJsxFiles = path.join(opts.root, 'dist/(layouts|store|templates)/**/*.jsx')
    const dist = path.join(opts.root, 'dist')
    const babelCfg = path.join(opts.root, 'babel.dev.config.js')

    chokidar
      .watch(websiteTypescriptFiles, watchOpts)
      .on('all', (event, file) => {
        console.log(`${file} ${event} detected, compiling...`)
        runCommand(`npx babel --config-file ${babelCfg} --keep-file-extension --extensions .ts,.tsx --out-file ${file.replace('/website/', '/dist/')} ${file}`)
        runCommand(`find ${dist} -name "*.ts" -exec sh -c 'mv "$0" "\${0%.ts}.js"' {} \\;`)
        runCommand(`find ${dist} -name "*.tsx" -exec sh -c 'mv "$0" "\${0%.tsx}.jsx"' {} \\;`)
      })

    chokidar
      .watch(distJsxFiles, watchOpts)
      .on('all', debounce(async () => {
        clearCache()
        await create(opts.buildConfig)
        console.log('\n Refreshing webpage ...')
        reloadServer.reload()
      }, 250, { isImmediate: true }))
  }

  ;(async () => {
    try {
      // const created = await create(groups[group], groupConfig)

      // Promise.all([less(groups[group]), uglifyJS(groups[group])]).then(async () => {
      //   await customPostScript(groups[group], created).catch(e => { throw e })
      //   if (!process.env.IGNORE_BROWSER) open(`http://localhost:8080/index.html`)
      // }).catch(err => {
      //   throw err
      // })

      console.log('\nBuilding Project')
      runCommand('tsc')
      const builtPages = await create(opts.buildConfig)
      if (!builtPages.length) throw new Error('No pages were built')

      console.log('\nStarting Dev Server')
      setTimeout(() => {
        app.listen(app.get('port'), () => { open(`http://localhost:8080/${builtPages[0]}.html`) })
      }, 250)

    } catch (e) {
      console.log(e, 'Error building', e.message)
    }

    watchForChanges()
  })()
}

export default DevServer
