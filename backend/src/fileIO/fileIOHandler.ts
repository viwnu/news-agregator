const fs = require("fs/promises")
const Emitter = require("events")

import fileIO from './fsOnClass'


let emitter = new Emitter()
let eventName = "file_released"

let fileBusy: boolean = false
const waitingFileRelease = async () => {
    if(!fileBusy) return true
    return new Promise<boolean>((res, rej) => {
        emitter.on(eventName, () => res(true))
    })
}

const Defrag = async (fileName: string) => {
    const file = new fileIO(fileName)
        
    const defragFilePath = file.dataFile.split('/')[0] + '/defrag.txt'
    const defragFile = new fileIO(defragFilePath)
    
    try {
        
        const fileStat = await fs.stat(file.dataFile)
        if(fileStat.size == 0) {
            return ('nothing to be deffraged')
        }

        await file.openFile()
        await defragFile.openFile()

        const chankSize = 10
        
        let positionsToread = []
        for (let i = file.indexses.length-1; i >=0; i -=chankSize) {
            positionsToread.push(i)
        }

        if(positionsToread.length == 0) {
            return ('nothing to be deffraged')
        }
        positionsToread.reverse()

        for (const position of positionsToread) {
            const readedData = await file.readData(chankSize, position)
            readedData?.reverse()

            for (const data of readedData!) {
                try {
                    await defragFile.writeData(data.dataStr, data.strIndex)
                } catch (error) {console.error(error)}
            }
        }
        
        await file.file?.close()
        await defragFile.file?.close()
        
        await fs.unlink(file.dataFile)
        await fs.unlink(file.indexFile)
        await fs.rename(defragFile.dataFile, file.dataFile)
        await fs.rename(defragFile.indexFile, file.indexFile)

        return ('defrag file is complete')
    } catch (error) {
        console.error('in Defrag: ' + error)
        await fs.unlink(defragFile.dataFile)
        await fs.unlink(defragFile.indexFile)
    } finally {
        await file.file?.close()
        await defragFile.file?.close()
    }
}

let DefragintervalId: NodeJS.Timer | null = null // создается при первом запросе на сервер, потом остается тем же

const DefragInterval = (filePath: string) => {
    if(DefragintervalId == null) {
        console.log('yeik')//все что внутри выполняется только при первом обращении к файлу
        DefragintervalId = setInterval(async () => {
            try {
                const waitingResult = await waitingFileRelease()
                fileBusy = waitingResult
                const defragRes = await Defrag(filePath)
                console.log(defragRes)
                return
            } catch(err) {console.error('in interval err', err)}
            finally {
                fileBusy = false
                emitter.emit(eventName)
            }
        }, 10000)
    }
}



const fileClassHadle = async (filePath: string, callbackFun: string, passedArg: string | number) => {
    const file = new fileIO(filePath)
    
    try {
        
        DefragInterval(filePath)

        const waitingResult = await waitingFileRelease()
        fileBusy = waitingResult
        
        await file.openFile()
        switch (callbackFun) {
            case 'readData':
                return await file.readData(passedArg as number)
            case 'writeData':
                return await file.writeData(passedArg as string)
            case 'deleteData':
                return await file.deleteData(passedArg as string)
            default:
                return new Error('bad function name in fileClassHandle')
                break;
        }
    } catch (error) {
        console.error(error)
    } finally {
        await file.file?.close()
        fileBusy = false
        emitter.emit(eventName)
    }
}

module.exports.readBundle = async (filePath: string) => {return(await fileClassHadle(filePath, 'readData', 10))}
module.exports.writeBundle = async (filePath: string, data: string) => {return(await fileClassHadle(filePath, 'writeData', data))}
module.exports.deleteBundle = async (filePath: string, srtIndex: number) => {return(await fileClassHadle(filePath, 'deleteData', srtIndex))}

