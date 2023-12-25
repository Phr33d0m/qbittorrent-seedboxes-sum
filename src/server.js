import axios from 'axios'
import { readCookie, saveCookie } from './utils.js'
import { logger } from './logger.js'
import chalk from 'chalk'
import figures from 'figures'

async function loginToServer(server) {
    const existingCookie = await readCookie(server.name)
    if (existingCookie) {
        return existingCookie
    }

    try {
        const response = await axios.post(
            `${server.url}/api/v2/auth/login`,
            `username=${server.username}&password=${server.password}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )
        if (response.status === 200) {
            const cookie = response.headers['set-cookie'][0]
            await saveCookie(server.name, cookie)
            logger.debug(
                chalk.green(`${figures.tick} Logged in to ${server.url}`)
            )
            return cookie
        } else {
            throw new Error('Login failed')
        }
    } catch (error) {
        logger.error(
            chalk.red(
                `${figures.cross} Error logging in to ${server.url}: ${error}`
            )
        )
        return null
    }
}

export async function fetchTorrentsFromServer(server) {
    const cookie = await loginToServer(server)
    if (!cookie) return []

    try {
        const response = await axios.get(`${server.url}/api/v2/sync/maindata`, {
            headers: { Cookie: cookie },
        })

        logger.debug(
            chalk.green(
                `${figures.tick} Data successfully obtained from ${server.url}: ${response.data.torrents.length} torrents`
            )
        )

        return Object.entries(response.data.torrents).map(
            ([hash, torrent]) => ({
                ...torrent,
                infohash_v1: hash,
                server: server.name,
            })
        )
    } catch (error) {
        logger.error(
            chalk.red(
                `${figures.cross} Error fetching from ${server.url}: ${error}`
            )
        )
        return []
    }
}
