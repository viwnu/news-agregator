import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
// import { createProxyMiddleware } from 'http-proxy-middleware'
import os from "os"
import { kv } from '@vercel/kv'
import { Agregation } from './routes'


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

app.get("/api/get-single-agregation", async function (req, res) {
  try {
    const id = req.query.id
    console.log('in /: ', id)
    console.log('type: ', typeof id)    
    if (typeof id === 'string' && id !== 'undefined' && id.length !== 0) {
      
      const agregation = await kv.get(id)
      if (agregation !== null || undefined) {
        res.send(agregation)
      } else {
        res.status(404).send(new Error('queri.id not match to agregation.id'))
      }
    } else {
      res.status(404).send(new Error('not matches this id'))
    }
  } catch (error) {
    res.send('in method get(by queri.id): ' + error)
  }

})

app.listen(port, () => {
  console.log(`Server running at http://${os.hostname()}:${port}/`)
})
