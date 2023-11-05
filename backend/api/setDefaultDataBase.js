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
Object.defineProperty(exports, "__esModule", { value: true });
const kv_1 = require("@vercel/kv");
const defaultNewsSources_1 = require("./defaultNewsSources");
const routes_1 = require("./routes");
function setDefaultDataBase(setdefault) {
    return __awaiter(this, void 0, void 0, function* () {
        if (setdefault) {
            console.log('in setDefaultDataBase ids: news Sorces: ', defaultNewsSources_1.newsSourses);
            let setDefaultDatabaseResult = 'not setted';
            for (const source of defaultNewsSources_1.newsSourses) {
                console.log('in loop source ', source);
                const setresult = yield kv_1.kv.set(source.id, JSON.stringify(source));
                console.log('setResult is: ', setresult);
                let numberOfAdded = 0;
                if (setresult === 'OK')
                    numberOfAdded = yield kv_1.kv.sadd(routes_1.nameOfIndexses, source.id);
                if (numberOfAdded > 0) {
                    setDefaultDatabaseResult = 'setted';
                }
                else {
                    setDefaultDatabaseResult = 'failed';
                }
            }
            return setDefaultDatabaseResult;
        }
        return '';
    });
}
exports.default = setDefaultDataBase;
