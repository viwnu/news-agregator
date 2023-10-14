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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const PORT = 8000;
const os_1 = __importDefault(require("os"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    exposedHeaders: '*'
}));
app.use('/api', (0, http_proxy_middleware_1.createProxyMiddleware)({ target: 'http://localhost:8000', changeOrigin: true }));
app.get('/', (req, res) => {
    res.json('jaha');
});
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
];
const articles = [];
newsSourses.forEach(source => {
    axios_1.default.get(source.adress)
        .then(((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        $('a', html).slice(0, 100).each(function (i, elem) {
            const title = $(elem).text();
            const url = $(elem).attr('href');
            articles.push({
                title,
                url: source.base + url,
                source: source.name
            });
        });
    })).catch((e) => console.log(e));
});
app.get('/news', (req, res) => {
    res.json(articles);
});
app.get('/news/:sourceId', (req, res) => {
    const sourceId = req.params.sourceId;
    const specificArticles = articles.filter(article => article.source == sourceId);
    res.json(specificArticles);
});
app.listen(PORT, () => {
    console.log(`Server running at http://${os_1.default.hostname()}:${PORT}/`);
});
