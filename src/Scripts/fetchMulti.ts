import path from 'path'
import fs from 'fs'
import { FetchMultiOpts } from '../MetalsmithLoader/types'
import fetch from 'node-fetch'

const defaultFetchConfig = {
  method: 'GET'
}

export default async (opts: FetchMultiOpts) => {
  const { root, items } = opts

  const outDir = path.join(root, 'dist', 'data')
  const outDirBuildTimeOnly = path.join(outDir, 'buildTimeOnlyData')

  // Create the directories if it doesn't already exist
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir)
  if (!fs.existsSync(outDirBuildTimeOnly)) fs.mkdirSync(outDirBuildTimeOnly)

  items.forEach(async ({ name, url, fetchConfig = defaultFetchConfig, outFile, buildTimeOnly = false }) => {
    if (!name) throw new Error('no name specified in fetch')
    if (!root) throw new Error('no root specified in fetch')
    if (!url) throw new Error('no url specified in fetch')
    if (!outFile) throw new Error('no outFile specified in fetch')

    console.log(`fetching: ${name} on ${url}`)

    const res = await fetch(url, fetchConfig)
    const data = JSON.stringify(await res.json())
    const outFilePath = buildTimeOnly
      ? path.join(outDirBuildTimeOnly, outFile)
      : path.join(outDir, outFile)

    fs.writeFile(outFilePath, data, err => {
      if (err) throw err
      console.log(`Saved ${outFilePath}`)
    })
  })
}
