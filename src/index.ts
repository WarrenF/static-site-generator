import MetalSmithLoader from './MetalsmithLoader'
import DevServer from './DevServer'
import { sass, fetch } from './Scripts'

export const devServer = DevServer
export const generateHtmlPages = MetalSmithLoader
export const generateCss = sass
export const apiRequest = fetch
