import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
// import { createProxyMiddleware } from 'http-proxy-middleware'
import os from "os"

import clearDataBase from './clearDataBase'
import setDefaultDataBase from './setDefaultDataBase'


const app = express()
const port = 8000

app.use(
  cors({
    exposedHeaders: "*",
  })
)

// app.use('/api', createProxyMiddleware({ target: `http://localhost:${port}`, changeOrigin: true }))

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



app.get("/api/dev", async function (req, res) {
  try {
    console.log('in api/dev req.query.default: ', req.query.default)
    const clearDataBaseResult = await clearDataBase()
    console.log('clearDataBaseResult: ', clearDataBaseResult)

    const setDefaultResult = await setDefaultDataBase(req.query.default === 'true')

    res.send("hi from dev! " + req.query.default ? `database default set is: ${setDefaultResult}` : '')
  } catch (error) {
    res.send('in deep: ' + error)
  }
})

app.listen(port, () => {
  console.log(`Server running at http://${os.hostname()}:${port}/`)
})
