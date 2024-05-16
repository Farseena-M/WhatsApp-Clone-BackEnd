const jwt = require('jsonwebtoken');
const User = require('../model/userSchema')

const verifyToken = async (req, res, next) => {
    const authToken = req.headers['authorization'];
    let token;

    if (authToken && authToken.startsWith('Bearer')) {
        token = authToken.split(' ')[1]; // Changed 'testToken' to 'token'
    } else {
        return res.status(401).json({ message: 'You are not logged in' });
    }

    try {
        // validate the token
        const decoded = jwt.verify(token, process.env.SECRET_STR);
     
        const userId = decoded.id
        const user = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

module.exports = verifyToken;
