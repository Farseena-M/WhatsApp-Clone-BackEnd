const asyncErrorHandler = require('../middlewares/asyncErrorHandler')
const User = require('../model/userSchema')
const cloudinary = require("cloudinary").v2;

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
    // Extract user ID from request parameters
    const userId = req.params.id;

    // Extract username, about, and image from request body
    const { username, about, image } = req.body;

    // Find the user by ID
    let user = await User.findById(userId);

    // If user is not found, return a 400 error
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Check if the user ID in the request matches the user ID found
    if (req.params.id !== userId.toString()) {
      return res.status(400).json({ error: "You can't update other user's profile" });
    }

    // If image is provided and user already has an image, delete the previous image from cloudinary
    if (image && user.image) {
      await cloudinary.uploader.destroy(user.image.split("/").pop(".")[0]);
    }

    // Update user's username, about, and image (if provided)
    user.username = username || user.username;
    user.about = about || user.about;
    user.image = image || user.image;

    // Save the updated user
    user = await user.save();

    // Return success message and updated user object
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    // Handle errors and return an appropriate error response
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



