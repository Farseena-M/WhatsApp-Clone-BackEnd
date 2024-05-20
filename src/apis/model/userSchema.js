const mongoose = require('mongoose')
const Validator = require('validator')
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    lowercase: true,
    validate: [Validator.isEmail, 'Please enter a valid Email']
  },
  phone: {
    type: String,
    unique: true,
    required: [true, 'Phone Number is Required'],
  },
  password: {
    type: String,
    required: [true, 'Password is Required'],
    select: false
  },
  image: {
    type: String,
    required: false,
    // default:
    //     "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  // username: {
  //   type: String,
  //   // required: [true, 'Username is required']
  // },
  about: {
    type: String
  },
  isDeleted: {
    type: Boolean,
    default: false,
    select: false
  },
  otp: { type: String, select: false },
  otpExpiredAt: { type: Date, select: false }
}, { timestamps: true })


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePasswordInDb = async (pswd, pswdDB) => {
  return bcrypt.compare(pswd, pswdDB)
}



const User = mongoose.model('User', userSchema)
module.exports = User