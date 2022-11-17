// Create the logger instance that has to be exported
// and used to log messages.
const Logger = {
  error: (err) => {
    console.log(err)
  },
}

export default Logger
