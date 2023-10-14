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
const fs = require("fs/promises");
const Emitter = require("events");
const fsOnClass_1 = __importDefault(require("./fsOnClass"));
let emitter = new Emitter();
let eventName = "file_released";
let fileBusy = false;
const waitingFileRelease = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!fileBusy)
        return true;
    return new Promise((res, rej) => {
        emitter.on(eventName, () => res(true));
    });
});
const Defrag = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const file = new fsOnClass_1.default(fileName);
    const defragFilePath = file.dataFile.split('/')[0] + '/defrag.txt';
    const defragFile = new fsOnClass_1.default(defragFilePath);
    try {
        const fileStat = yield fs.stat(file.dataFile);
        if (fileStat.size == 0) {
            return ('nothing to be deffraged');
        }
        yield file.openFile();
        yield defragFile.openFile();
        const chankSize = 10;
        let positionsToread = [];
        for (let i = file.indexses.length - 1; i >= 0; i -= chankSize) {
            positionsToread.push(i);
        }
        if (positionsToread.length == 0) {
            return ('nothing to be deffraged');
        }
        positionsToread.reverse();
        for (const position of positionsToread) {
            const readedData = yield file.readData(chankSize, position);
            readedData === null || readedData === void 0 ? void 0 : readedData.reverse();
            for (const data of readedData) {
                try {
                    yield defragFile.writeData(data.dataStr, data.strIndex);
                }
                catch (error) {
                    console.error(error);
                }
            }
        }
        yield ((_a = file.file) === null || _a === void 0 ? void 0 : _a.close());
        yield ((_b = defragFile.file) === null || _b === void 0 ? void 0 : _b.close());
        yield fs.unlink(file.dataFile);
        yield fs.unlink(file.indexFile);
        yield fs.rename(defragFile.dataFile, file.dataFile);
        yield fs.rename(defragFile.indexFile, file.indexFile);
        return ('defrag file is complete');
    }
    catch (error) {
        console.error('in Defrag: ' + error);
        yield fs.unlink(defragFile.dataFile);
        yield fs.unlink(defragFile.indexFile);
    }
    finally {
        yield ((_c = file.file) === null || _c === void 0 ? void 0 : _c.close());
        yield ((_d = defragFile.file) === null || _d === void 0 ? void 0 : _d.close());
    }
});
let DefragintervalId = null; // создается при первом запросе на сервер, потом остается тем же
const DefragInterval = (filePath) => {
    if (DefragintervalId == null) {
        console.log('yeik'); //все что внутри выполняется только при первом обращении к файлу
        DefragintervalId = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const waitingResult = yield waitingFileRelease();
                fileBusy = waitingResult;
                const defragRes = yield Defrag(filePath);
                console.log(defragRes);
                return;
            }
            catch (err) {
                console.error('in interval err', err);
            }
            finally {
                fileBusy = false;
                emitter.emit(eventName);
            }
        }), 10000);
    }
};
const fileClassHadle = (filePath, callbackFun, passedArg) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const file = new fsOnClass_1.default(filePath);
    try {
        DefragInterval(filePath);
        const waitingResult = yield waitingFileRelease();
        fileBusy = waitingResult;
        yield file.openFile();
        switch (callbackFun) {
            case 'readData':
                return yield file.readData(passedArg);
            case 'writeData':
                return yield file.writeData(passedArg);
            case 'deleteData':
                return yield file.deleteData(passedArg);
            default:
                return new Error('bad function name in fileClassHandle');
                break;
        }
    }
    catch (error) {
        console.error(error);
    }
    finally {
        yield ((_e = file.file) === null || _e === void 0 ? void 0 : _e.close());
        fileBusy = false;
        emitter.emit(eventName);
    }
});
module.exports.readBundle = (filePath) => __awaiter(void 0, void 0, void 0, function* () { return (yield fileClassHadle(filePath, 'readData', 10)); });
module.exports.writeBundle = (filePath, data) => __awaiter(void 0, void 0, void 0, function* () { return (yield fileClassHadle(filePath, 'writeData', data)); });
module.exports.deleteBundle = (filePath, srtIndex) => __awaiter(void 0, void 0, void 0, function* () { return (yield fileClassHadle(filePath, 'deleteData', srtIndex)); });
