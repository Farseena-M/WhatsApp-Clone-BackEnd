const asyncErrorHandler = require('../middlewares/asyncErrorHandler')
const User = require('../model/userSchema')

const getUsers = asyncErrorHandler(async (req, res) => {
  try {
    const loggedUsers = req.params.id
    const users = await User.find({ _id :{ $ne : loggedUsers }})
    return res.status(200).json({ data: users, message: 'Successfull' })
  } catch (error) {
    return res.status(500).json(error.message)
  }
})

const getOneUser = asyncErrorHandler(async (req, res) => {
  try {
    const userId = req.params.id
    const getUser = await User.findById(userId)
    return res.status(200).json({ data: getUser, message: 'Successfull' })
  } catch (error) {
    return res.status(500).json(error.message)

  }
})

const updateUser = asyncErrorHandler(async (req, res) => {
  try {
    const userId = req.params.id
    const updated = await User.findByIdAndUpdate(userId, req.body)
    return res.status(200).json({ data: updated, message: 'Successfully updated' })
  } catch (error) {
    return res.status(500).json(error.message)

  }
})


const deleteUser = asyncErrorHandler(async (req, res) => {
  try {
    const userId = req.params.id
    await User.findByIdAndDelete(userId)
    return res.status(200).json({ message: 'Successfully deleted' })
  } catch (error) {
    return res.status(500).json(error.message)

  }
})

module.exports = {
  getUsers,
  getOneUser,
  updateUser,
  deleteUser
}



