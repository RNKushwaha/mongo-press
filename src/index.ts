import Logger from '@utils/logger'
import app from './app'

const port = process.env.PORT

app.listen(port, () => {
    console.log(
        '⚡️[server]: Server is running at http://localhost' +
            (port != null ? ':' + port : ''),
    )
}).on('error', (err) => {
    Logger.error(err)
    process.exit(1)
})
