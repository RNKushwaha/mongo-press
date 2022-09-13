import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'module-alias/register';
import morganMiddleware from '@middlewares/morgan';
import Logger from '@utils/logger';

const app: Express = express();

app.use(cookieParser())
app.disable('x-powered-by');

app.use(morganMiddleware)

const allowlist: string[] = ['http://localhost:3000', 'http://localhost:4002']
const corsOptionsDelegate = function (req: Request, callback: any) {
  const hdr = req.header('Origin')
  let corsOptions = {
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
    ],
    credentials: true,
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],// TODO: not working
    preflightContinue: false,
    exposedHeaders: ['Content-Length'],
    origin: false,// disable CORS for this request
  }

  if(hdr!= undefined && allowlist.includes(hdr)){
    corsOptions.origin = true // enable the requested origin in the CORS response
  }

  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(compression({ filter: shouldCompress }))

function shouldCompress (req: Request, res: Response) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

app.get('/', (req: Request, res: Response) => {
  res.json({app: 'Express + TypeScript Server GET'});
});

app.post('/', (req: Request, res: Response) => {
  res.json({app: 'Express + TypeScript Server POST'});
});

// for sample logging
app.get("/logger", (req: Request, res: Response) => {
  Logger.error("This is an error log");
  Logger.warn("This is a warn log");
  Logger.info("This is a info log");
  Logger.http("This is a http log");
  Logger.debug("This is a debug log");

  res.json({app: 'Logger test'});
});

export default app;
