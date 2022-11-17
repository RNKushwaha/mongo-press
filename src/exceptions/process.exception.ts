import { errorHandler } from './'

process.on('uncaughtException', (error: Error) => {
  // I just received an error that was never handled,
  // time to handle it and then decide whether a restart is needed
  errorHandler.handleError(error)
})

process.on('unhandledRejection', (error: Error, p: Promise<any>) => {
  // I just caught an unhandled promise rejection,
  // since we already have fallback handler for unhandled errors (see below),
  // let throw and let him handle that
  throw error
})
