import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

// Read and parse the configuration file
const configPath = path.resolve(import.meta.dirname, '../config.json')
const configFile = fs.readFileSync(configPath, 'utf8')
const config = JSON.parse(configFile)

export const argv = yargs(hideBin(process.argv))
    .option('torrents', {
        alias: 't',
        describe: 'Number of torrents to display',
        type: 'number',
        default: 10,
    })
    .option('debug', {
        alias: 'd',
        describe: 'Enable debug mode',
        type: 'boolean',
        default: false,
    })
    .version('1.0.0')
    .check((argv) => {
        if (argv.torrents < 0 || isNaN(argv.torrents)) {
            throw new Error('Invalid number of torrents specified.')
        }
        return true
    }).argv

export default config
