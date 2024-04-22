const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' })
const app = require('../src/app')
const connectDb = require('./config/dbConnect')
const { server } = require('./apis/socket/socket')

connectDb()

const port = 4000
server.listen(port, () => {
    console.log(`Listening to ${port}`);
})