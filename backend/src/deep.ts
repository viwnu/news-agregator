import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
// import { createProxyMiddleware } from 'http-proxy-middleware'
import os from "os"
import { kv } from '@vercel/kv'

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

app.get("/api/deep", async function (req, res) {
  try {
    console.log(req.query.name)

    const list = await kv.lrange('agregations', 0, -1) as {id: string}[]
    console.log('the list: ', list)
    
    list.forEach(async item => {
      if (item.id) {
        console.log('the id: ', item.id);
        await kv.getdel(item.id)
      }
      
    })
    const lpoped = await kv.lpop('agregations', 100)
    console.log('lpoped: ', lpoped)

    res.send("hi from deep, and the query patam is: " + req.query.name)
  } catch (error) {
    res.send('in deep: ' + error)
  }
})

app.listen(port, () => {
  console.log(`Server running at http://${os.hostname()}:${port}/`)
})
