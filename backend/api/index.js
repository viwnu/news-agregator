"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const bodyParser = require("body-parser");
const cors_1 = __importDefault(require("cors"));
// import { createProxyMiddleware } from 'http-proxy-middleware'
const os_1 = __importDefault(require("os"));
const app = express();
const port = 8000;
app.use((0, cors_1.default)({
    exposedHeaders: '*'
}));
// app.use('/api', createProxyMiddleware({ target: `http://localhost:${port}`, changeOrigin: true }))
const index_1 = __importDefault(require("./routes/index"));
// const messagesRouter = require('./routes/messages')
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// add router in express app
app.use("/api", index_1.default);
app.listen(port, () => {
    console.log(`Server running at http://${os_1.default.hostname()}:${port}/`);
});
