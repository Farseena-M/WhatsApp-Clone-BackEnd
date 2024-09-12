const asyncErrorHandler = require('../middlewares/asyncErrorHandler')
const User = require('../model/userSchema')
const cloudinary = require("cloudinary").v2;

const getUsers = asyncErrorHandler(async (req, res) => {
  try {
    const loggedUsers = req.params.id
    const users = await User.find({ _id: { $ne: loggedUsers } })
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
    const updated = await User.findByIdAndUpdate(userId)
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

const updateUserProfile = asyncErrorHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, image, about } = req.body;

    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ error: "You can't Update other user's profile" });

    if (image && user.image) {
      const publicId = user.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    user.username = username || user.username;
    user.about = about || user.about;
    user.image = image || user.image;

    user = await user.save();

    res.status(200).json({ message: "Profile upadated succesfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in updateUser: ", error.message);
  }
});


module.exports = {
  getUsers,
  getOneUser,
  updateUser,
  deleteUser,
  updateUserProfile
}



