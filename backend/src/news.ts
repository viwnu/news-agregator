/* eslint-disable @typescript-eslint/no-explicit-any */
const PORT = 8000

import os from 'os'
import express, { Express, Request, Response } from 'express'
import bodyParser from "body-parser"
import cors from 'cors'
import axios from 'axios'
import * as cheerio from 'cheerio'

const app: Express = express()

app.use(cors({
    exposedHeaders: '*'
}))

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

type Article = {
  url: string;
  source: string;
  title:string;
}

const articles: Article[] = []

import { Agregation } from './routes'


const fetchArticles = async (newsSourse: Agregation) => {
    let articles: Article[] = []
    const rawArticle = await axios.get(newsSourse.url)
    const html = rawArticle.data
    const $ = cheerio.load(html)
    $('a', html).slice(0,100).each(function (i: number, elem: any) {
        const title = $(elem).text()
        const url = $(elem).attr('href')
        articles.push({
            title,
            url: newsSourse.url + url,
            source: newsSourse.title
        })
    })
    return articles
}

app.get('/api/news', async (req: Request, res: Response) => {
    try {
        const source = req.query as Agregation
        console.log('in api/news source = ', source)
        res.send(await fetchArticles(source))
    } catch (error) {
     res.status(500).send('then api/news error: ' + error)   
    }
})

app.listen(PORT, () => {
    console.log(`Server running at http://${os.hostname()}:${PORT}/`);
})