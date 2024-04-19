const jwt = require('jsonwebtoken')


const generateToken = (id) => {
    return jwt.sign({ id }, `${process.env.SECRET_STR}`, {
        expiresIn: 60 * 60 * 24
    })

}

module.exports = generateToken