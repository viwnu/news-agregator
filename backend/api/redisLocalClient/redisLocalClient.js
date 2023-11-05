"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
function createRedisLocalClient() {
    try {
        client.on('error', err => console.log('Redis Client Error', err));
        return client;
    }
    catch (error) {
        console.log('Redis Client Error', error);
    }
}
exports.default = createRedisLocalClient;
