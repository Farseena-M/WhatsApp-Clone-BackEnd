const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: path.join(__dirname, 'config.env') })


const connectDb = async () => {
    try {
        await mongoose.connect(process.env.LOCAL_CONN_STR)
        console.log('DB connected');
    } catch (err) {
        console.log(err);
    }
}


module.exports = connectDb