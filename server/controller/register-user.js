const UserModel = require("../models/user-model");
const bcryptjs = require("bcryptjs");

async function registerUser(request, response) {
  try{
    const { name, email, password, profile_pic } = request.body;

    const checkMail = await UserModel.findOne({ email });

    if(checkMail) return response.status(400).json({
      message: "User with the email already exist.",
      error: true,
    });

    const hashedPassword = await bcryptjs.hash(password, 10);
    
    const payload = {
      name,
      email,
      profile_pic,
      password: hashedPassword
    };
    
    await UserModel.create(payload);

    return response.status(201).json({
      message: "User created successfully",
      data: { ...payload, password: '' },
      success: true,
    });

  }catch(error) {
    console.log("Error at registerUser", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = registerUser;
