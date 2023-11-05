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
const routes_1 = require("./routes");
function clearDataBase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('in clearDatabase nameOfIndexses: ', routes_1.nameOfIndexses);
            const list = yield kv_1.kv.smembers(routes_1.nameOfIndexses);
            console.log('the list: ', list);
            list.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                if (item.id) {
                    console.log('the id: ', item.id);
                    yield kv_1.kv.getdel(item.id);
                }
            }));
            const lpoped = yield kv_1.kv.spop(routes_1.nameOfIndexses, 100);
            console.log('lpoped: ', lpoped);
            return 'OK';
        }
        catch (error) {
            return `error in clearDataBase: ${error}`;
        }
    });
}
exports.default = clearDataBase;
