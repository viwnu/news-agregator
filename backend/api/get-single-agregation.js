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
app.get("/api/get-single-agregation", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.query.id;
            console.log('in /: ', id);
            console.log('type: ', typeof id);
            if (typeof id === 'string' && id !== 'undefined' && id.length !== 0) {
                const agregation = yield kv_1.kv.get(id);
                if (agregation !== null || undefined) {
                    res.send(agregation);
                }
                else {
                    res.status(404).send(new Error('queri.id not match to agregation.id'));
                }
            }
            else {
                res.status(404).send(new Error('not matches this id'));
            }
        }
        catch (error) {
            res.send('in method get(by queri.id): ' + error);
        }
    });
});
app.listen(port, () => {
    console.log(`Server running at http://${os_1.default.hostname()}:${port}/`);
});
