const express = require('express')
var bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/', function (req, res) {
  console.log('res')
  res.write(JSON.stringify({
    'name': 'app',
    'version': '0.0.2',
    'asar': 'http://127.0.0.1:4000/update.zip',
    // 'sha1': '203448645d8a32b9a08ca9a0eb88006f874d0c78', // Optional, If set, verify `asar` file legitimacy
    'info': '1.fix bug 2.feat...'
  }).replace(/[\\/]/g, '\\/'))
  res.end()
})

app.listen(3000)
console.log('run port: 3000')
