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
exports.nameOfIndexses = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const kv_1 = require("@vercel/kv");
exports.nameOfIndexses = 'agregations';
router.post('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(`Заголовки запроса: ${Object.keys(req)}`);
        const data = req.body;
        console.log(`Incoming to server Data = ${data}`);
        for (const key in data) {
            console.log('in data ' + key);
            console.log(data[key]);
        }
        try {
            const setresult = yield kv_1.kv.set(data.id, JSON.stringify(data));
            console.log('setResult is: ', setresult);
            let numberOfAdded = 0;
            if (setresult === 'OK')
                numberOfAdded = yield kv_1.kv.sadd(exports.nameOfIndexses, data.id);
            if (numberOfAdded > 0)
                res.end(setresult);
        }
        catch (error) {
            console.log('then method post: ', error);
            res.send('then method post' + error);
        }
    });
});
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const indexses = yield kv_1.kv.smembers(exports.nameOfIndexses);
        console.log('indexses ', indexses);
        const getAgregations = (indexses) => __awaiter(void 0, void 0, void 0, function* () {
            let list = [];
            for (const id of indexses) {
                const item = yield kv_1.kv.get(id);
                console.log(item);
                list.push(item);
                // For local dev:
                // console.log(JSON.parse(item as string))
                // list.push(JSON.parse(item as string))
            }
            return list;
        });
        const list = yield getAgregations(indexses);
        console.log('the list: ', list);
        list.length > 0
            ? res.send(list)
            : res.status(404).send('empty storage');
    }
    catch (error) {
        console.log('in method get: ', error);
    }
}));
router.patch('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    console.log('in /: ', id);
    console.log('type: ', typeof id);
    if (typeof id === 'string' && id !== 'undefined' && id.length !== 0) {
        try {
            const haveKey = (yield kv_1.kv.get(id)) !== null || undefined;
            const setresult = haveKey ? yield kv_1.kv.set(id, req.body) : null;
            if (setresult === 'OK') {
                res.end(setresult);
            }
            else {
                res.status(404).send(new Error('dont setted'));
            }
        }
        catch (error) {
            console.log('in method patch: ', error);
        }
    }
}));
router.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    console.log('in /: ', id);
    console.log('type: ', typeof id);
    if (typeof id === 'string' && id !== 'undefined' && id.length !== 0) {
        try {
            const deleteResult = yield kv_1.kv.getdel(id);
            console.log('deleteResult', deleteResult);
            const deleteSucces = deleteResult !== null || undefined;
            console.log('deleteSucces', deleteSucces);
            let removedCount = 0;
            if (deleteSucces) {
                removedCount = yield kv_1.kv.srem('agregations', id);
            }
            console.log('removedCount', removedCount);
            removedCount > 0
                ? res.end('ok')
                : res.status(404).send(new Error('queri.id not match to agregation.id'));
        }
        catch (error) {
            console.log('in method delete: ', error);
        }
    }
}));
exports.default = router;
