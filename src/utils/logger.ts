import { addColors, createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const LOG_PATH = 'logs'

// This method set the current severity based on
// the current NODE_ENV: show all the log levels
// if the server was run in development mode; otherwise,
// if it was run in production, show only warn and error messages.
const level = (): string => {
    const env = process.env.NODE_ENV ?? 'development'
    return env === 'development' ? 'debug' : 'warn'
}

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
// Tell winston that you want to link the colors
// defined above to the severity levels.
addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
})

// Create the logger instance that has to be exported
// and used to log messages.
const Logger = createLogger({
    level: level(),
    // Define your severity levels.
    // With them, You can create log files,
    // see or hide levels based on the running ENV.
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
    // Chose the aspect of your log customizing the log format.
    format: format.combine(
        // requestIdFormat(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        format.printf(
            (info) =>
                `${String(info.timestamp)} | ${String(info.level)}: ${String(
                    info.message,
                )}`,
        ),
        format.errors({ stack: true }),
        format.prettyPrint(), // writes as json
    ),
    // Define which transports the logger must use to print out messages.
    // In this example, we are using three different transports
    transports: [
        // Allow the use the console to print the messages
        new transports.Console({
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
                format.printf(
                    (info) =>
                        `${String(info.timestamp)} | ${String(
                            info.level,
                        )}: ${String(info.message)}`,
                ),
                format.errors({ stack: true }),
                // format.prettyPrint(),
                // Tell Winston that the logs must be colored
                format.colorize({ all: true }),
            ),
        }),
        // Allow to print all the error level messages inside the error.log file
        // new transports.File({
        //   filename: "logs/error.log",
        //   level: "error",
        // }),
        new DailyRotateFile({
            filename: LOG_PATH + '/%DATE%-error.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            level: 'error',
            handleExceptions: true,
        }),
        // Allow to print all the error message inside the all.log file
        // (also the error log that are also printed inside the error.log(
        // new transports.File({ filename: "logs/all.log" }),
        new DailyRotateFile({
            filename: LOG_PATH + '/%DATE%-all.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            handleExceptions: true,
        }),
    ],
    exceptionHandlers: [
        new DailyRotateFile({
            filename: LOG_PATH + '/%DATE%-exceptions.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            handleExceptions: true,
        }),
        // new transports.File({ filename: 'logs/exceptions.log' })
    ],
    rejectionHandlers: [
        new DailyRotateFile({
            filename: LOG_PATH + '/%DATE%-rejections.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            handleExceptions: true,
        }),
    ],
    exitOnError: false,
})

export default Logger
