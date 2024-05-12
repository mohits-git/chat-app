const UserModel = require("../models/user-model");

async function searchUser(request, response) {
  try {
    const { search } = request.body;

    const query = new RegExp(search, "i", "g");

    const users = await UserModel.find({
      "$or": [
        { name: query },
        { email: query },
      ]
    }).select('-password');

    return response.json({
      message: "all users",
      data: users,
      success: true
    });
  } catch (error) {
    console.log("Error at searchUser", error);
    res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
} 

module.exports = searchUser;
