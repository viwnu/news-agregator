"use strict";
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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
// import { createProxyMiddleware } from 'http-proxy-middleware'
const os_1 = __importDefault(require("os"));
const kv_1 = require("@vercel/kv");
const app = (0, express_1.default)();
const port = 8000;
app.use((0, cors_1.default)({
    exposedHeaders: "*",
}));
// app.use('/api', createProxyMiddleware({ target: `http://localhost:${port}`, changeOrigin: true }))
//Here we are configuring express to use body-parser as middle-ware.
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.get("/api/deep", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(req.query.name);
            const list = yield kv_1.kv.lrange('agregations', 0, -1);
            console.log('the list: ', list);
            list.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                if (item.id) {
                    console.log('the id: ', item.id);
                    yield kv_1.kv.getdel(item.id);
                }
            }));
            const lpoped = yield kv_1.kv.lpop('agregations', 100);
            console.log('lpoped: ', lpoped);
            res.send("hi from deep, and the query patam is: " + req.query.name);
        }
        catch (error) {
            res.send('in deep: ' + error);
        }
    });
});
app.listen(port, () => {
    console.log(`Server running at http://${os_1.default.hostname()}:${port}/`);
});
