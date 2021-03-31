import { BuildConfig } from '../MetalsmithLoader/types'
import { generateHtmlPages } from '../'

const create = async (buildConfig: BuildConfig): Promise<string[]> => {
  return new Promise((resolve) => {
    generateHtmlPages({
      ...buildConfig,
      webpackCallback: (err: any, data: any[]) => {
        if (err) throw err
        return resolve(data)
      }
    })
  })
}

export default create
