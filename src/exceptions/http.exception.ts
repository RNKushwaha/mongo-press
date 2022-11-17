export enum HttpCode {
  OK = 200,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

interface HttpExceptionArgs {
  name?: string
  httpCode: HttpCode
  message: string
  isOperational?: boolean
}

export class HttpException extends Error {
  public readonly name: string
  public readonly httpCode: HttpCode
  public readonly isOperational: boolean = true

  constructor(args: HttpExceptionArgs) {
    super(args.message)

    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain

    this.name = args.name ?? 'Error'
    this.httpCode = args.httpCode

    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational
    }

    Error.captureStackTrace(this)
  }
}
