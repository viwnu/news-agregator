/* eslint-disable @typescript-eslint/no-explicit-any */
const PORT = 8000

import os from 'os'
import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { createProxyMiddleware } from 'http-proxy-middleware'
import axios from 'axios'
import * as cheerio from 'cheerio'

const app: Express = express()

app.use(cors({
    exposedHeaders: '*'
}))

app.use('/api', createProxyMiddleware({ target: 'http://localhost:8000', changeOrigin: true }))

app.get('/', (req:Request, res:Response) => {
    res.json('jaha')
})

const newsSourses = [
    {
        name: "coin360",
        adress: 'https://coin360.com/news',
        base: '',
    },
    {
        name: "coindesk",
        adress: 'https://www.coindesk.com',
        base: '',
    },
    {
        name: "cointelegraph",
        adress: 'https://cointelegraph.com/',
        base: '',
    },
    {
        name: "crypto.com",
        adress: 'https://crypto.com/trending',
        base: 'https://crypto.com',
    },
    {
        name: "crypto.news",
        adress: 'https://crypto.news/',
        base: '',
    },
    {
        name: "cryptopotato",
        adress: 'https://cryptopotato.com/',
        base: '',
    }
    
]

type Article = {
  url: string;
  source: string;
  title:string;
}

const articles: Article[] = []


newsSourses.forEach(source => {
    axios.get(source.adress)
        .then(((response: { data: any }) => {
            const html = response.data
            const $ = cheerio.load(html)
            $('a', html).slice(0,100).each(function (i: number, elem: any) {
                const title = $(elem).text()
                const url = $(elem).attr('href')
                articles.push({
                    title,
                    url: source.base + url,
                    source: source.name
                })
            })
            
        })).catch((e:Error) => console.log(e))
})

app.get('/news', (req: Request, res: Response) => {
    res.json(articles)
})

app.get('/news/:sourceId', (req: Request, res: Response) => {
    const sourceId = req.params.sourceId
    
    const specificArticles = articles.filter(article => article.source == sourceId)
    res.json(specificArticles)
})

app.listen(PORT, () => {
    console.log(`Server running at http://${os.hostname()}:${PORT}/`);
})