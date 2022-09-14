import { Request } from 'express'

const corsOptionsDelegate = function (allowlist: string[]) {
    return function (req: Request, callback: any) {
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
            methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'], // TODO: not working
            preflightContinue: false,
            exposedHeaders: ['Content-Length'],
            origin: false, // disable CORS for this request
        }

        if (hdr != undefined && allowlist.includes(hdr)) {
            corsOptions.origin = true // enable the requested origin in the CORS response
        }

        callback(null, corsOptions) // callback expects two parameters: error and options
    }
}

export default corsOptionsDelegate
