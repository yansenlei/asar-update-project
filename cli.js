const axios = require('axios')

axios({
  url: 'http://localhost:3000',
  method: 'post'
}).then(res => {
  console.log(res.data)
})
