import { logger } from './logger.js'
import chalk from 'chalk'
import figures from 'figures'
import fs from 'fs/promises'
import path from 'path'

const cookiesPath = path.resolve(import.meta.dirname, '../cookies')

export function sanitizeFilename(name) {
    return name.replace(/[^a-zA-Z0-9-_.]/g, '_')
}

export async function readCookie(serverName) {
    try {
        if (!serverName) {
            throw new Error('Server name is undefined')
        }
        const sanitizedServerName = sanitizeFilename(serverName)
        const cookiePath = path.resolve(
            cookiesPath,
            `${sanitizedServerName}.cookie`
        )

        const cookie = await fs.readFile(cookiePath, 'utf8')
        logger.debug(
            chalk.green(
                `${figures.tick} Cookie found for ${sanitizedServerName}`
            )
        )
        return cookie
    } catch (error) {
        logger.debug(
            chalk.yellow(
                `No existing cookie for ${serverName}: ${error.message}`
            )
        )
    }
    return null
}

export async function saveCookie(serverName, cookie) {
    try {
        if (!serverName) {
            throw new Error('Server name is undefined')
        }
        const sanitizedServerName = sanitizeFilename(serverName)
        const cookiePath = path.resolve(
            cookiesPath,
            `${sanitizedServerName}.cookie`
        )
        await fs.writeFile(cookiePath, cookie, 'utf8')
        logger.debug(chalk.green(`Cookie saved for ${sanitizedServerName}`))
    } catch (error) {
        logger.error(
            chalk.red(`Error saving cookie for ${serverName}: ${error.message}`)
        )
    }
}

export async function deleteCookie(serverName) {
    try {
        if (!serverName) {
            throw new Error('Server name is undefined')
        }
        const sanitizedServerName = sanitizeFilename(serverName)
        const cookiePath = path.resolve(
            cookiesPath,
            `${sanitizedServerName}.cookie`
        )
        await fs.unlink(cookiePath)
        logger.debug(chalk.green(`Cookie deleted for ${sanitizedServerName}`))
    } catch (error) {
        logger.error(
            chalk.red(
                `Error deleting cookie for ${serverName}: ${error.message}`
            )
        )
    }
}
