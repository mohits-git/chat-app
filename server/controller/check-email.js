const UserModel = require("../models/user-model");

async function checkEmail(req, res) {
  try {
    const { email } = req.body;

    const emailExist = await UserModel.findOne({ email }).select("-password");
    if (!emailExist) {
      return res.status(400).json({
        message: "User does not exist",
        error: true,
      });
    }

    return res.status(200).json({
      message: "Email verified",
      success: true,
      data: emailExist,
    });
    
  } catch (error) {
    console.log("Error at checkEmail", error);
    res.status(500).json({
      message: error.message || error,
      error: true,
    })
  }
}

module.exports = checkEmail;
