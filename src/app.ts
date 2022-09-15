import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'module-alias/register'
import helmet from 'helmet'

import morganMiddleware from '@middlewares/morgan'
import Logger from '@utils/logger'
import corsOptionsDelegate from '@middlewares/cors'

const allowlist: string[] = ['http://localhost:3000', 'http://localhost:4002']

function shouldCompress(req: Request, res: Response) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }

    // fallback to standard filter function
    return compression.filter(req, res)
}

// initialize the app
const app: Express = express()

// now apply middlewares one by one
// enable cookie parser
app.use(helmet())
app.use(cookieParser())
// disable x-powered-by header
app.disable('x-powered-by')
// add morgon & winston logger
app.use(morganMiddleware)
// enable CORS
app.use(cors(corsOptionsDelegate(allowlist)))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// compress response
app.use(compression({ filter: shouldCompress }))

// add routers
app.get('/', (req: Request, res: Response) => {
    res.json({ app: 'Express + TypeScript Server GET' })
})

app.post('/', (req: Request, res: Response) => {
    res.json({ app: 'Express + TypeScript Server POST' })
})

// for sample logging
app.get('/logger', (req: Request, res: Response) => {
    Logger.error('This is an error log')
    Logger.warn('This is a warn log')
    Logger.info('This is a info log')
    Logger.http('This is a http log')
    Logger.debug('This is a debug log')

    res.json({ app: 'Logger test' })
})

export default app
