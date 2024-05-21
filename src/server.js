const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' })
const app = require('../src/app')
const connectDb = require('./config/dbConnect')
const { server } = require('./apis/socket/socket')
const { PeerServer} = require('peer')
const { Server } = require('socket.io');
const http = require('http');


connectDb()

// create peerServer WebRTC

PeerServer({port:3002, path:'/'})

app.use('/', (req, res) => {
    res.write('Hey this is working')
})


const port = 4000
server.listen(port, () => {
    console.log(`Listening to ${port}`);
})