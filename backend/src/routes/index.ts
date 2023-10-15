import express from 'express'
const router = express.Router()
import { kv } from '@vercel/kv'


export type Agregation = {
    id: string,
    title: string;
    url: string;
    keywords: string[];
}
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface AgregationsState  {
    agregations: Agregation[];
}

export const nameOfIndexses = 'agregations'


router.post('/', async function(req: {body: Agregation} ,res){
    // console.log(`Заголовки запроса: ${Object.keys(req)}`);
    const data = req.body
    console.log(`Incoming to server Data = ${data}`);
    for (const key in data) {
        console.log('in data ' + key)
        console.log(data[key as keyof typeof data])
    }
    try {
      const setresult = await kv.set(data.id, data)
      console.log('setResult is: ', setresult)
      let numberOfAdded = 0
      if (setresult === 'OK') numberOfAdded = await kv.sadd(nameOfIndexses, data.id)
      if (numberOfAdded > 0) res.end(setresult)
    } catch (error) {
      console.log('then method post: ', error)
      res.send('then method post' + error)
    }
})  

router.get("/", async (req: any, res) => {
    
    try {
        const indexses = await kv.smembers(nameOfIndexses)
        console.log('indexses ', indexses)
        const getAgregations = async (indexses: string[]) => {
            let list = []
            for (const id of indexses) {
                const item = await kv.get(id)
                console.log(item)
                list.push(item)
            }
            return list
        }
        const list = await getAgregations(indexses)
        console.log('the list: ', list)
        list.length > 0
            ? res.send(list)
            : res.status(404).send('empty storage')
        
    } catch (error) {
      console.log('in method get: ', error)
    }

})

router.patch('/', async (req: any, res) => {
    const id = req.query.id
    console.log('in /: ', id)
    console.log('type: ', typeof id)
    if (typeof id === 'string' && id !== 'undefined' && id.length !== 0) {
        try {
            const haveKey = await kv.get(id) !== null || undefined
            const setresult = haveKey? await kv.set(id, req.body) : null
            if (setresult === 'OK') {
                res.end(setresult)
            } else {
                res.status(404).send(new Error('dont setted'))
            }
        } catch (error) {
            console.log('in method patch: ', error)
        }
    }

})
  
router.delete('/', async (req: any, res) => {
    const id = req.query.id
    console.log('in /: ', id)
    console.log('type: ', typeof id)
    if (typeof id === 'string' && id !== 'undefined' && id.length !== 0) {
        try {
            const deleteResult = await kv.getdel(id)
            console.log('deleteResult', deleteResult)
            const deleteSucces = deleteResult !== null || undefined
            console.log('deleteSucces', deleteSucces)
            
            let removedCount = 0
            if (deleteSucces) {
                removedCount = await kv.srem('agregations', id)
            }
            console.log('removedCount', removedCount)
            removedCount > 0
                ? res.end('ok')
                : res.status(404).send(new Error('queri.id not match to agregation.id'))
        } catch (error) {
            console.log('in method delete: ', error)
        }
    }

})
  
export default router