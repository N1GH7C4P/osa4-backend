const config = require('./utils/config')
const middleware =  require('./utils/middleware')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})

app.use(express.static('build'))
console.log("Build loaded.")

app.use(bodyParser.json())
console.log("Using body parser.")

app.use(cors())
console.log("Using cors.")

app.use(middleware.requestLogger)
console.log("Using request logger.")

app.use('/api/blogs', blogsRouter)
console.log("Using blogsRouter.")

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
console.log("Using unknownEndpoint & errorHandler.")