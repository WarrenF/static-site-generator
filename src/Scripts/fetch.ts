import path from 'path'
import fs from 'fs'
import { fetchOpts } from '../MetalsmithLoader/types'
import fetch from 'node-fetch'

const defaultFetchConfig = {
  method: 'GET'
}

export default async (opts: fetchOpts) => {
  const { root, url, fetchConfig = defaultFetchConfig, outFile } = opts

  if (!root) throw new Error('no root specified in fetch')
  if (!url) throw new Error('no url specified in fetch')
  if (!outFile) throw new Error('no outFile specified in fetch')

  console.log(`fetching: ${url}`)
  const res = await fetch(url, fetchConfig)
  const data = JSON.stringify(await res.json())

  const outDir = path.join(root, 'build', 'config')
  const outFilePath = path.join(outDir, outFile)

  // Create the directory if it doesn't already exist
  if (!fs.existsSync(outDir)){
    fs.mkdirSync(outDir)
  }

  fs.writeFile(outFilePath, data, err => {
    if (err) throw err
    console.log(`Saved ${outFilePath}`)
  })

}
