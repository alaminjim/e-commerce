const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const checkUserName = await User.findOne({ userName });
    if (checkUserName)
      return res.json({
        success: false,
        message: "Username already taken! Please try another one",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ userName, email, password: hashPassword });
    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Internal Server Error" 
    });
  }
};

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exist! Please register first",
      });

    const isMatch = await bcrypt.compare(password, checkUser.password);
    if (!isMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "365d" }
    );

    // send token in JSON (no cookies)
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token, // client stores in localStorage
      user: {
        id: checkUser._id,
        email: checkUser.email,
        userName: checkUser.userName,
        role: checkUser.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// logout (frontend removes token)
const logoutUser = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully! Remove token from localStorage.",
  });
};

// auth middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ success: false, message: "Unauthorised" });

  const token = authHeader.split(" ")[1];
  try {
    if (!process.env.CLIENT_SECRET_KEY)
      throw new Error("JWT Secret not defined");

    const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ success: false, message: "Unauthorised" });
  }
};

// google login
const googleLogin = async (req, res) => {
  const { token } = req.body;
  try {
    // Fetch user info from Google using the access token
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    const data = await response.json();

    if (!data || !data.email) {
      return res.status(400).json({ success: false, message: "Invalid Google token" });
    }

    const { name, email, sub } = data;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        userName: name || email.split("@")[0],
        email: email,
        password: sub,
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
      },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "365d" }
    );

    res.status(200).json({
      success: true,
      message: "Google login successful",
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        userName: user.userName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ success: false, message: "Google Auth Failed" });
  }
};

// update profile
const updateProfile = async (req, res) => {
  try {
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({
        success: false,
        message: "User ID and Username are required!",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Check if new userName is already taken by another user
    const existingUser = await User.findOne({ userName, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already taken! Please try another one.",
      });
    }

    user.userName = userName;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        userName: user.userName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  googleLogin,
  updateProfile,
};

