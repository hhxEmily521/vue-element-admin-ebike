const express = require('express')
const path = require('path')
const app = express()

const port = 8081

const history = require('connect-history-api-fallback')

// 重定向到index.html
history({
  rewrites: [{
    from: /^\/libs\/.*$/,
    to: '/index.html'
  }]
})

app.use(history())

app.use(express.static(path.join(__dirname, 'dist')));

app.listen(port, () => {
  console.log('Listening at http://localhost:' + port)
})
