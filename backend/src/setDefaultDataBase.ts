import { kv } from '@vercel/kv'
import { newsSourses } from './defaultNewsSources'
import { nameOfIndexses } from './routes'

export default async function setDefaultDataBase(setdefault: boolean) {
    if (setdefault) {
        console.log('in setDefaultDataBase ids: news Sorces: ', newsSourses)
        let setDefaultDatabaseResult = 'not setted'
        for (const source of newsSourses) {
            console.log('in loop source ', source)
            const setresult = await kv!.set(source.id as string, JSON.stringify(source))
            console.log('setResult is: ', setresult)
            let numberOfAdded = 0
            if (setresult === 'OK') numberOfAdded = await kv!.sadd(nameOfIndexses, source.id)
            if (numberOfAdded > 0) {setDefaultDatabaseResult = 'setted'} else {setDefaultDatabaseResult = 'failed'}
        }
        return setDefaultDatabaseResult
    }
    return ''
}