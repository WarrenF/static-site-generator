export type BuildConfig = {
  assets?: string
  callback?: (err?: any, data?: any) => any
  clean?: boolean
  config?: any
  dataSource?: any
  destination: string
  devMode?: boolean
  layoutDir?: string
  markDownSource?: string
  showReactIDs?: boolean
  src: string
  templateDir?: string
  webpack?: string
  webpackCallback?: (err?: any, data?: any) => any
  webpackOptions?: any
}

export type WebpackGenerateOutputOptions = {
  callback?: (err?: any, data?: any) => any
  dest: string
  destFilename: string
  directory: string
  noConflict: boolean
  options: any
  tempDir: string
  webpack: any
}

export type Page = {
  template: string // template from md file
  baseFile: string // baseFile from md file
  contents: string // string of all generate page html
  mode: string // Metalsmith mode string
  stats: any // Metalsmith stats object
  pageName?: string // Page url eg: 'category/test-page'
  html?: string // Html generated from md files (below yaml config)
}
