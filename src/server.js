const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' })
const app = require('../src/app')
const connectDb = require('./config/dbConnect')
const { server } = require('./apis/socket/socket')
const { PeerServer} = require('peer')


connectDb()

// create peerServer WebRTC

PeerServer({port:3001, path:'/'})

app.use('/', (req, res) => {
    res.write('Hey this is working')
})


const port = 9000
server.listen(port, () => {
    console.log(`Listening to ${port}`);
})