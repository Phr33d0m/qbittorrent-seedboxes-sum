import { fetchTorrentsFromServer } from './server.js'
import config, { argv } from './config.js'
import prettyBytes from 'pretty-bytes'

async function processTorrents() {
    let allTorrents = []

    for (const server of config.servers) {
        const torrents = await fetchTorrentsFromServer(server)
        allTorrents.push(...torrents)
    }

    const combinedTorrents = allTorrents.reduce((acc, torrent) => {
        if (acc[torrent.infohash_v1]) {
            acc[torrent.infohash_v1].dlspeed += torrent.dlspeed
            acc[torrent.infohash_v1].upspeed += torrent.upspeed
            acc[torrent.infohash_v1].ratio += torrent.ratio

            acc[torrent.infohash_v1].servers.push(torrent.server)
        } else {
            acc[torrent.infohash_v1] = { ...torrent, servers: [torrent.server] }
        }
        return acc
    }, {})

    return Object.values(combinedTorrents).sort((a, b) => b.upspeed - a.upspeed)
}

export async function displayTopTorrents() {
    const sortedTorrents = await processTorrents()
    return sortedTorrents.slice(0, argv.torrents).map((torrent, index) => ({
        Rank: index + 1,
        Name: torrent.name,
        'Download Speed': prettyBytes(torrent.dlspeed) + '/s',
        'Upload Speed': prettyBytes(torrent.upspeed) + '/s',
        Ratio: +torrent.ratio.toFixed(2),
        'Found On': torrent.servers.join(', '),
    }))
}
