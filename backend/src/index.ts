const express = require('express')
const bodyParser = require("body-parser")
import cors from 'cors'
// import { createProxyMiddleware } from 'http-proxy-middleware'
import os from 'os'

const app = express()
const port = 8000

app.use(cors({
  exposedHeaders: '*'
}))

// app.use('/api', createProxyMiddleware({ target: `http://localhost:${port}`, changeOrigin: true }))

const routes = require('./routes/index')

// const messagesRouter = require('./routes/messages')

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// add router in express app
app.use("/api",routes)

app.listen(port, () => {
  console.log(`Server running at http://${os.hostname()}:${port}/`)
})