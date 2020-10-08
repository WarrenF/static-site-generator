import { BuildConfig } from '../MetalsmithLoader/types'
import { generateHtmlPages } from '../'

const create = async (opts: BuildConfig): Promise<string[]> => {
  return new Promise((resolve) => {
    generateHtmlPages({
      ...opts,
      webpackCallback: (err: any, data: any[]) => {
        if (err) throw err
        return resolve(data)
      }
    })
  })
}

export default create
