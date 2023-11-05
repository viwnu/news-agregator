import { createClient } from 'redis'

const client = createClient()

export default function createRedisLocalClient() {
    try {
        client.on('error', err => console.log('Redis Client Error', err))
        return client
    } catch (error) {
        console.log('Redis Client Error', error)
    }

}