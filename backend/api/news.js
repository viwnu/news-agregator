"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
/* eslint-disable @typescript-eslint/no-explicit-any */
const PORT = 8000;
const os_1 = __importDefault(require("os"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const cheerio = __importStar(require("cheerio"));
require('dotenv').config();
const news = (0, express_1.default)();
// for local dev:
// const news = express.Router()
news.use((0, cors_1.default)({
    origin: '*'
}));
//Here we are configuring express to use body-parser as middle-ware.
news.use(body_parser_1.default.urlencoded({ extended: false }));
news.use(body_parser_1.default.json());
const articles = [];
const getSpaHtml = (url) => __awaiter(void 0, void 0, void 0, function* () {
    let browser = null;
    try {
        console.log('in getSpaHtml browser before: ', browser);
        browser = yield puppeteer_core_1.default.connect({ browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.CLOUD_BROWSERLESS}` });
        console.log('after: ', browser);
        const page = yield browser.newPage();
        yield page.goto(url);
        yield new Promise(r => setTimeout(r, 2000));
        const html = yield page.evaluate(() => {
            var _a;
            return (_a = document.querySelector('html')) === null || _a === void 0 ? void 0 : _a.innerHTML;
        });
        yield browser.close();
        return html ? html : '';
    }
    catch (error) {
        console.log('in get SPA HTML: ', error);
        return `${error}`;
    }
});
const fetchArticles = (newsSourse) => __awaiter(void 0, void 0, void 0, function* () {
    let articles = [];
    const html = yield getSpaHtml(newsSourse.url);
    const $ = cheerio.load(html);
    // writeFileSync('cherio.html', $.html())
    $('a', html).slice(0, 200).each(function (i, elem) {
        var _a;
        const splitSelector = () => newsSourse.selector.split(' ');
        const contents = newsSourse.selector.length === 0
            ? $(elem).text()
            : splitSelector().length > 1 && splitSelector()[1] === '<'
                ? $(elem).closest(splitSelector()[0]).text()
                : $(elem).find(newsSourse.selector).text();
        if (contents.length > 0) {
            articles.push({
                id: i,
                title: contents,
                url: (_a = newsSourse.baseUrl + $(elem).attr('href')) !== null && _a !== void 0 ? _a : '',
                source: newsSourse.title
            });
        }
    });
    return articles;
});
news.get('/api/news', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const source = req.query;
        console.log('source = ', source);
        res.send(yield fetchArticles(source));
    }
    catch (error) {
        console.log('in api/news error: ', error);
        res.status(500).send('then api/news error: ' + error);
    }
}));
news.listen(PORT, () => {
    console.log(`Server running at http://${os_1.default.hostname()}:${PORT}/`);
});
exports.default = news;
