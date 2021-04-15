import path from 'path'
import fs from 'fs'
import CleanCSS from 'clean-css'
import sass from 'node-sass'
import { SassOpts } from '../MetalsmithLoader/types'

export default (opts: SassOpts) => {
  const { root, inFile, outFile } = opts

  // Add template group to this
  const __cssSourceDirectory = path.join(root, 'website', 'stylesheets')
  const __cssDestination = path.join(root, 'build', 'css')

  const inFilePath = path.join(__cssSourceDirectory, inFile)
  const outFilePath = path.join(__cssDestination, outFile)

  // @ts-ignore
  sass.render({ file: inFilePath }, function(err, result) {
    if (err) throw err
    const output = new CleanCSS({}).minify(result.css.toString())

    // Create the directory if it doesn't already exist
    if (!fs.existsSync(__cssDestination)){
      fs.mkdirSync(__cssDestination);
    }

    fs.writeFile(outFilePath, output.styles, function(err){
      if (err) throw err
      console.log(`Saved ${outFilePath}`)
    })
  })
}
