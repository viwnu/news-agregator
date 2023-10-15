import express from 'express'

const {readBundle, writeBundle, deleteBundle} = require('../fileIO/fileIOHandler')

const router = express.Router()

const dataBaseFilePath = 'src/agregations/agregations.txt'

router.get('/', function (req: any, res) { res.send('hellow from agregations lvl') })

router.post('/send', async function(req: {body: object} ,res: { send: (arg0: { sendData: any }) => void }){
    // console.log(`Заголовки запроса: ${Object.keys(req)}`);
    const data = req.body
    console.log(`Incoming to server Data = ${data}`);
    for (const key in data) {
        console.log('in data obj')
        console.log(data[key as keyof typeof data])
    }
    writeBundle(dataBaseFilePath, JSON.stringify(data))
      .then((sendData: any) => {
        console.log('the response from fileIO: ', sendData)
        res.send({sendData})
    })
})  

router.get("/get", async (req: any, res) => {
    readBundle(dataBaseFilePath, 10)
      .then((data: {dataStr: string}[]) => {
          console.log('the response from fileIO: ', data)
          const sendData = data.map(item => {
            return JSON.parse(item.dataStr)
          })
          res.send(sendData)
      })
  })

  router.get("/get/:agregationId", (req: any, res) => {
    readBundle(dataBaseFilePath, 10)
    .then((data: {dataStr: string}[]) => {
        console.log('the response from fileIO: ', data)
        const agregations = data.map(item => {
            return JSON.parse(item.dataStr)
        })
        const singleAgregation = agregations.find(agregation => (
            agregation.id === req.params.agregationId
        ))
        singleAgregation
            ?res.send(singleAgregation)
            :res.status(404).send('Not found')
    })
  })

  router.patch('/patch/:agregationId', async (req: any, res) => {
    console.log(req.params.agregationId)
    try {
      const deletedData = await deleteBundle(dataBaseFilePath, req.params.agregationId)
      if (!deletedData) { return res.status(404).send('Not found') }

      const data = req.body
      const sendData = await writeBundle(dataBaseFilePath, JSON.stringify(data))
      console.log('the response from fileIO: ', sendData)
      res.send({sendData})

    } catch (error) {
      res.status(500).send('Something goes wrong...')
    }

  })
  
  router.delete('/delete/:agregationId', async (req: any, res) => {
    console.log(req.params.agregationId)
    try {
      const deletedData = await deleteBundle(dataBaseFilePath, req.params.agregationId)
      deletedData
        ? res.send({deletedData})
        : res.status(404).send('Not found')

    } catch (error) {
      res.status(500).send('Something goes wrong...')
    }
  })
  
  module.exports = router