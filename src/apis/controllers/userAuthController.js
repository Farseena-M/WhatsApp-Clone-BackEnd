const User = require('../model/userSchema')
const asyncErrorHandler = require('../middlewares/asyncErrorHandler')
const generateToken = require('../utils/generateToken')

const SignUp = asyncErrorHandler(async (req, res) => {
    try {
        const { name, email, password, phone, image } = req.body
        const Exist = await User.findOne({ name })
        if (Exist) {
            return res.status(409).json({
                error: 'User already exists'
            })
        }
        const newUser = new User({
            name: name,
            email: email,
            password: password,
            phone: phone,
            image: image
        })

        await newUser.save()
        const token = generateToken(newUser._id)


        return res.status(201).json({
            status: 'Success',
            token,
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
            phone: newUser.phone,
            image: newUser.image
        })
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Internal server error'
        })
        console.log(error);
    }
})


const Login = asyncErrorHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email && !password) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const findUser = await User.findOne({ email }).select('+password')
    if (!findUser || !(await findUser.comparePasswordInDb(password, findUser.password))) {
        return res.status(404).json({ message: 'Incorrect email or password' })
    }

    const token = generateToken(findUser._id)

    return res.status(200).json({
        message:'Success',
        token,
        findUser
    })

})



module.exports = {
    SignUp, Login
}