const UserModel = require("../models/user-model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function checkPassword(req, res) {
  try {
    const { password, userId } = req.body;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
        error: true,
      });
    }

    const verifyPassword = await bcryptjs.compare(password, user.password);

    if (!verifyPassword) {
      return res.status(401).json({
        message: "Incorrect Password",
        error: true,
      });
    }

    const tokenPayload = {
      userId: user._id,
      email: user.email,
    }
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

    const cookieOptions = {
      http: true,
      secure: true,
    }

    return res
      .cookie('token', token, cookieOptions)
      .status(200)
      .json({
        message: "Logged in successfully",
        token: token,
        success: true,
      });

  } catch (error) {
    console.log("Error at checkPassword", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = checkPassword;
