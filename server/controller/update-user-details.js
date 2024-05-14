const getUserDetailsFromToken = require("../helper/get-user-details-from-token");
const UserModel = require("../models/user-model");

async function updateUserDetails(request, response) {
  try{
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')?.[1] || '';

    const user = await getUserDetailsFromToken(token);

    if(!user?._id)
      return response.status(400).json({
        message: "User not found.",
        error: true
      });

    const { name, profile_pic } = request.body;

    const updatedUser = await UserModel.updateOne({ _id: user._id }, {
      name: name,
      profile_pic: profile_pic
    });

    if(!updatedUser) 
      return response.status(400).json({
        message: "Could not update user.",
        error: true
      });

    const userDetails = await UserModel.findById(user._id).select("-password");

    return response.json({
      message: "User updated successfully",
      data: userDetails,
      success: true,
    });
  } catch (error) {
    console.log("Error at updateUserDetails", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = updateUserDetails;
