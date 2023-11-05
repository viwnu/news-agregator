import express from 'express'
import bodyParser from "body-parser"
import cors from 'cors'
import os from 'os'

const app = express()
const port = 8000

console.log(process.env.KV_REST_API_URL);

app.use(cors({
  exposedHeaders: '*'
}))

import routes from './routes/index'
// need For dev:
// import news from './news'

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// add router in express app
app.use("/api",routes)
// app.use("/",news)


app.listen(port, () => {
  console.log(`Server running at http://${os.hostname()}:${port}/`)
})