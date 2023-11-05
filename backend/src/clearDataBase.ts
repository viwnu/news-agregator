import { kv } from '@vercel/kv'

import { nameOfIndexses } from './routes'

export default async function clearDataBase() {
    try {
        console.log('in clearDatabase nameOfIndexses: ', nameOfIndexses)
        const list = await kv.smembers(nameOfIndexses) as {id: string}[]
        console.log('the list: ', list)
        
        list.forEach(async item => {
        if (item.id) {
            console.log('the id: ', item.id);
            await kv.getdel(item.id)
        }})

        const lpoped = await kv.spop(nameOfIndexses, 100)
        console.log('lpoped: ', lpoped)
        return 'OK'
    } catch (error) {
        return `error in clearDataBase: ${error}`
    }
}