import express           from 'express'
import fs                from 'fs'
import path              from 'path'
import { fileURLToPath } from 'url'

// --------------
// CONFIGURATION
const COUNTER_FILE='counter.txt'
const PORT=9999

// --------------
// CONFIGURATION via dotenv
// npm install dotenv
// import dotenv            from 'dotenv'
// const dotenv_result = dotenv.config({ path: '.env' })
// if (dotenv_result.error) { throw dotenv_result.error }
// const COUNTER_FILE = process.env.COUNTER_FILE
// const PORT = process.env.PORT

// --------------
// basedir
const serverpath = fileURLToPath(import.meta.url)
global.__basedir = path.dirname(serverpath)

// --------------
// counter_file
let current_counter = "0"
let counterfile = COUNTER_FILE
if( ! counterfile ) { counterfile = 'default.txt'; }
counterfile = __basedir + '/' + counterfile
if (fs.existsSync(counterfile)) {
  try {
    current_counter = fs.readFileSync(counterfile, 'utf8');
  } catch (err) {
    console.error(err);
  }
  console.log("starting up: found the file for counter,", current_counter)
}
else {
  console.log("starting up: counter file does not exist, trying to create")
  current_counter = "0"
  fs.writeFileSync(counterfile, current_counter, err => {
    console.log("        writing to file", output_file)
    if (err) {
      console.error(err)
    }
  })
}

// --------------
// app
const app = express()
app.use('/', (req, res) => {
    let my_counter = parseInt(current_counter)
    my_counter++
    current_counter = my_counter.toString()
    fs.writeFile(counterfile, current_counter, err => {
        // console.log("        writing to file", counterfile)
        if (err) {
          console.error(err);
        }
      })
    console.log(current_counter)
    res.send(current_counter)
})

// --------------
// start server
const startServer = async () => {
  let server = app.listen(PORT || 8080, () => {
    console.debug('\x1b[34mPort        :', server.address().port)
    console.debug('\x1b[34mTime        : ' + new Date().toLocaleString('zh-TW'))
    console.debug('\x1b[34mBaseDir     :', __basedir)
    console.debug('\x1b[34mCounterFIle :', counterfile)
    console.debug('\x1b[0m')
  })
}
startServer()
