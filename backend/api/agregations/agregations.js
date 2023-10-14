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
const kv_1 = require("@vercel/kv");
const { readBundle, writeBundle, deleteBundle } = require('../fileIO/fileIOHandler');
const router = express_1.default.Router();
const dataBaseFilePath = 'src/agregations/agregations.txt';
router.get('/', function (req, res) { res.send('hellow dura4ok'); });
router.post('/send', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(`Заголовки запроса: ${Object.keys(req)}`);
        const data = req.body;
        console.log(`Incoming to server Data = ${data}`);
        for (const key in data) {
            console.log('in data obj');
            console.log(data[key]);
        }
        try {
            const listLength = yield kv_1.kv.lpush('agregations', data);
        }
        catch (error) {
            console.log('in agregations/send: ', error);
        }
        writeBundle(dataBaseFilePath, JSON.stringify(data))
            .then((sendData) => {
            console.log('the response from fileIO: ', sendData);
            res.send({ sendData });
        });
    });
});
router.get("/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const list = yield kv_1.kv.lrange('agregations', 0, -1);
        console.log(list);
    }
    catch (error) {
        console.log('in agregations/get: ', error);
    }
    readBundle(dataBaseFilePath, 10)
        .then((data) => {
        console.log('the response from fileIO: ', data);
        const sendData = data.map(item => {
            return JSON.parse(item.dataStr);
        });
        res.send(sendData);
    });
}));
router.get("/get/:agregationId", (req, res) => {
    readBundle(dataBaseFilePath, 10)
        .then((data) => {
        console.log('the response from fileIO: ', data);
        const agregations = data.map(item => {
            return JSON.parse(item.dataStr);
        });
        const singleAgregation = agregations.find(agregation => (agregation.id === req.params.agregationId));
        singleAgregation
            ? res.send(singleAgregation)
            : res.status(404).send('Not found');
    });
});
router.patch('/patch/:agregationId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.agregationId);
    try {
        const deletedData = yield deleteBundle(dataBaseFilePath, req.params.agregationId);
        if (!deletedData) {
            return res.status(404).send('Not found');
        }
        const data = req.body;
        const sendData = yield writeBundle(dataBaseFilePath, JSON.stringify(data));
        console.log('the response from fileIO: ', sendData);
        res.send({ sendData });
    }
    catch (error) {
        res.status(500).send('Something goes wrong...');
    }
}));
router.delete('/delete/:agregationId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.agregationId);
    try {
        const deletedData = yield deleteBundle(dataBaseFilePath, req.params.agregationId);
        deletedData
            ? res.send({ deletedData })
            : res.status(404).send('Not found');
    }
    catch (error) {
        res.status(500).send('Something goes wrong...');
    }
}));
module.exports = router;
