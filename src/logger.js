import winston from 'winston'
import chalk from 'chalk'
import { argv } from './config.js'

export const logger = winston.createLogger({
    level: argv.debug ? 'debug' : 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `${chalk.gray(`[${timestamp}]`)} ${level}: ${message}`
        })
    ),
    transports: [new winston.transports.Console()],
})
