async function logout(request, response) {
  try {
    const cookieOptions = {
      http: true,
      secure: true,
      domain: process.env.FRONTEND_DOMAIN,
      sameSite: 'none',
    }
    return response.cookie('token', '', cookieOptions).status(200).json({
      message: "session out",
      success: true,
    })
  } catch (error) {
    console.log("Error at logout", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = logout;
