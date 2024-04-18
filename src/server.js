const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' })
const app = require('../src/app')
const connectDb = require('./config/dbConnect')

connectDb()

const port = 4000
app.listen(port, () => {
    console.log(`Listening to ${port}`);
})