import { Response } from 'express'
import { HttpCode, HttpException } from './'

class ErrorHandler {
  public isTrustedError(error: Error): boolean {
    if (error instanceof HttpException) {
      return error.isOperational
    }
    return false
  }

  private handleTrustedError(error: HttpException, res: Response): void {
    res.status(error.httpCode).json({ message: error.message })
  }

  private handleCriticalError(
    error: Error | HttpException,
    res?: Response,
  ): void {
    if (res) {
      res
        .status(HttpCode.INTERNAL_SERVER_ERROR)
        .json({ message: 'Internal server error' })
    }

    console.error('Application encountered a critical error. Exiting', error)
    process.exit(1)
  }

  public handleError(error: Error | HttpException, res?: Response): void {
    // await logger.logError(error)
    if (this.isTrustedError(error) && res) {
      this.handleTrustedError(error as HttpException, res)
    } else {
      this.handleCriticalError(error, res)
    }
  }
}

export const errorHandler = new ErrorHandler()
