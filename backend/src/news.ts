import puppeteer from 'puppeteer-core'

/* eslint-disable @typescript-eslint/no-explicit-any */
const PORT = 8000

import os from 'os'
import express, { Express, Request, Response } from 'express'
import bodyParser from "body-parser"
import cors from 'cors'
import * as cheerio from 'cheerio'
import { writeFile, writeFileSync } from 'fs'
require('dotenv').config()

const news: Express = express()

// for local dev:
// const news = express.Router()

news.use(cors({
    origin: '*'
}))

//Here we are configuring express to use body-parser as middle-ware.
news.use(bodyParser.urlencoded({ extended: false }))
news.use(bodyParser.json())

type Article = {
    id: number,
    url: string;
    source: string;
    title:string;
}

const articles: Article[] = []

export type Agregation = {
    id: string,
    title: string;
    url: string;
    baseUrl: string;
    selector: string;
    keywords: string[];
}

const getSpaHtml = async (url: string) => {
    let browser = null
    try {
        console.log('in getSpaHtml browser before: ', browser)
        browser = await puppeteer.connect({browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.CLOUD_BROWSERLESS}`})
        console.log('after: ', browser)
        const page = await browser.newPage()
        await page.goto(url)
        await new Promise(r => setTimeout(r, 2000))
    
        const html = await page.evaluate(() => {
          return document.querySelector('html')?.innerHTML
        })
        await browser.close()
        return html ?html :''
    } catch (error) {
      console.log('in get SPA HTML: ', error)
      return `${error}`
    }
} 


const fetchArticles = async (newsSourse: Agregation) => {
    let articles: Article[] = []

    const html = await getSpaHtml(newsSourse.url)

    const $ = cheerio.load(html)

    // writeFileSync('cherio.html', $.html())

    $('a', html).slice(0,200).each(function (i: number, elem: any) {
        const splitSelector = () => newsSourse.selector.split(' ')
                
        const contents = newsSourse.selector.length === 0
            ? $(elem).text()
            : splitSelector().length > 1 && splitSelector()[1] === '<'
                ? $(elem).closest(splitSelector()[0]).text()
                : $(elem).find(newsSourse.selector).text()

        if (contents.length > 0) {
            articles.push({
                id: i,
                title: contents,
                url: newsSourse.baseUrl + $(elem).attr('href') ?? '',
                source: newsSourse.title
            })
        }
        
    })

    return articles
}

news.get('/api/news', async (req: Request, res: Response) => {
    try {
        const source = req.query as Agregation
        console.log('source = ', source)
        res.send(await fetchArticles(source))
    } catch (error) {
        console.log('in api/news error: ', error)
        res.status(500).send('then api/news error: ' + error)   
    }
})

news.listen(PORT, () => {
    console.log(`Server running at http://${os.hostname()}:${PORT}/`);
})

export default news