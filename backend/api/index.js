"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const os_1 = __importDefault(require("os"));
const app = (0, express_1.default)();
const port = 8000;
console.log(process.env.KV_REST_API_URL);
app.use((0, cors_1.default)({
    exposedHeaders: '*'
}));
const index_1 = __importDefault(require("./routes/index"));
// need For dev:
// import news from './news'
//Here we are configuring express to use body-parser as middle-ware.
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
// add router in express app
app.use("/api", index_1.default);
// app.use("/",news)
app.listen(port, () => {
    console.log(`Server running at http://${os_1.default.hostname()}:${port}/`);
});
