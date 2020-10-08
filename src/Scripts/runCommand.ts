import { execSync } from 'child_process'

const runCommand = (cmd: string, path?: string) => execSync(cmd, {
  cwd: path || process.cwd()
}).toString()

export default runCommand
