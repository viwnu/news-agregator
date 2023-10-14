import express from 'express'
const router = express.Router()

const agregations = require('../agregations/agregations')

router.use('/agregations', agregations)
  
module.exports = router