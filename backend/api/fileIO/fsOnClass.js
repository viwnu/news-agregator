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
const promises_1 = __importDefault(require("fs/promises"));
class fileIO {
    constructor(dataFile) {
        this.indexses = [];
        this.openFile = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.file = yield promises_1.default.open(this.dataFile, 'r+');
                yield this.readIndex(this.indexFile);
                return this;
            }
            catch (err) {
                try {
                    this.file = yield promises_1.default.open(this.dataFile, 'a+');
                    yield this.readIndex(this.indexFile);
                    return this;
                }
                catch (err) {
                    console.error('in openFile: ' + err);
                }
            }
        });
        this.readIndex = (indexFile) => __awaiter(this, void 0, void 0, function* () {
            try {
                const readedIndexes = yield promises_1.default.readFile(indexFile);
                const indexses = readedIndexes.toString().split(',\n').slice(0, -1).map(obj => JSON.parse(obj));
                this.setIndexses(indexses);
                return (indexses);
            }
            catch (err) {
                if (err.code == 'ENOENT') {
                    const indexses = [];
                    this.setIndexses(indexses);
                    return indexses;
                }
                else {
                    console.error('in readIndex: ' + err);
                }
            }
        });
        this.writeIndex = (indexses) => __awaiter(this, void 0, void 0, function* () {
            try {
                const indexsesStr = indexses.reduce((str, indexItem) => {
                    return (str + JSON.stringify(indexItem) + ',\n');
                }, '');
                yield promises_1.default.writeFile(this.indexFile, indexsesStr);
                return ('indexses was written');
            }
            catch (err) {
                console.error('in writeIndex: ' + err);
            }
        });
        this.setIndexses = (indexses) => {
            this.indexses = indexses;
        };
        this.addIndex = (dataLength, indexses, defragStrIndex, id = '') => __awaiter(this, void 0, void 0, function* () {
            try {
                let position = 0;
                let nextIndex = 0;
                if (indexses.length) {
                    const sortedIndexses = [...indexses].sort((a, b) => { return (a.start - b.end); });
                    position = sortedIndexses.reduce((prev, curr) => {
                        if (curr.start - prev.end > dataLength) {
                            return prev;
                        }
                        else {
                            return curr;
                        }
                    }).end;
                    nextIndex = (defragStrIndex ? defragStrIndex : indexses[indexses.length - 1].strIndex + 1);
                }
                indexses.push({
                    start: position,
                    end: position + dataLength,
                    strIndex: nextIndex,
                    id
                });
                this.setIndexses(indexses);
                return (position);
            }
            catch (err) {
                console.error('in addIndex: ' + err);
            }
        });
        this.readData = (lengthToRead, endIndex = this.indexses.length - 1) => __awaiter(this, void 0, void 0, function* () {
            try {
                const indexses = this.indexses;
                const start = endIndex - lengthToRead < 0 ? -1 : endIndex - lengthToRead;
                const buf = Buffer.alloc(1024);
                const dataStrings = [];
                let indexPositions = [];
                for (let i = endIndex; i > start; i--) {
                    indexPositions.push(i);
                }
                for (const indexPosition of indexPositions) {
                    const length = indexses[indexPosition].end - indexses[indexPosition].start;
                    const bites = yield this.file.read(buf, 0, length, indexses[indexPosition].start);
                    dataStrings.push({
                        dataStr: buf.slice(0, bites.bytesRead).toString().slice(0, -1),
                        strIndex: indexses[indexPosition].strIndex
                    });
                }
                return (dataStrings);
            }
            catch (err) {
                'in readData: ' + console.error(err);
            }
        });
        this.writeData = (data, defragStrIndex = 0) => __awaiter(this, void 0, void 0, function* () {
            try {
                const indexses = this.indexses;
                const dataLength = Buffer.from(data).length + 1;
                const position = yield this.addIndex(dataLength, indexses, defragStrIndex, JSON.parse(data).id);
                const written = yield this.file.write(data + '\n', position ? position : 0);
                yield this.writeIndex(this.indexses);
                return (yield this.readData(1));
            }
            catch (err) {
                console.error('in writeData: ' + err);
            }
        });
        this.deleteData = (id = this.indexses[this.indexses.length - 1].id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const indexses = this.indexses;
                const index = indexses.findIndex((index) => index.id == id);
                const strToBeDeleted = yield this.readData(1, index);
                if (index >= 0) {
                    indexses.splice(index, 1);
                    this.setIndexses(indexses);
                    this.writeIndex(indexses);
                    return (strToBeDeleted);
                }
                else {
                    return false;
                }
            }
            catch (err) {
                console.error('in deleteData: ' + err);
            }
        });
        this.buf = Buffer.alloc(1024);
        this.dataFile = dataFile;
        this.indexFile = this.dataFile.split('.')[0] + 'Index.txt';
    }
}
exports.default = fileIO;
// дочитать про классы, добавить может публичные и закрытые поля или еще что то если будет нужно
