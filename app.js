import { displayTopTorrents } from './src/torrents.js'

const torrents = await displayTopTorrents()

console.table(torrents)
