import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import swaggerUi, { JsonObject } from 'swagger-ui-express'
import yml from 'js-yaml'
import path from 'path'
import fs from 'fs'

// import morganMiddleware from '@middlewares/morgan'
import corsOptionsDelegate from '@middlewares/cors'
// import Logger from '@utils/logger'
import routes from '@routes/index'
import { allowedHosts } from '@config/constants'

const allowHosts: string[] = allowedHosts

const shouldCompress = (req: Request, res: Response): boolean => {
  if (req.headers['x-no-compression'] != null) {
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
// its blocking event loop, so using pino
// for more details, run
// clinic doctor --autocannon [ -m GET /api/users ] -- node dist/index.js
// app.use(morganMiddleware)
// enable CORS
app.use(cors(corsOptionsDelegate(allowHosts)))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// compress response
app.use(compression({ filter: shouldCompress }))

// add routes
app.use('/api', routes)

// Swagger API docs
// let swaggerFile = ''
const swaggerFile = yml.load(
  fs.readFileSync(path.join('dist', 'openapi.yaml'), 'utf8'),
)
// fs.writeFileSync('swagger.json', JSON.stringify(swaggerFile, null, 2))
app.use('/explorer', swaggerUi.serve)
app.get('/explorer', swaggerUi.setup(swaggerFile as JsonObject))

// catch 404 and forward to error handler
// app.use((req: Request, res: Response, next: NextFunction) => {
//   const err = new Error('Not Found')
//   err.status = 404
//   next(err)
// })

// // error handlers
// app.use((err, req: Request, res: Response, next: NextFunction) => {
//   // handle 401 thrown by express-jwt library
//   if (err.name === 'UnauthorizedError') {
//     return res
//       .status(err.status)
//       .send({ message: err.message })
//       .end()
//   }
//   return next(err)
// })

// app.use((err, req: Request, res: Response, next: NextFunction) => {
//   res.status(err.status || 500)
//   res.json({
//     errors: {
//       message: err.message,
//     },
//   })
// })

export default app
