const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ userName, email, password: hashPassword });
    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
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
  const authHeader = req.headers.authorization; // "Bearer <token>"
  if (!authHeader)
    return res.status(401).json({ success: false, message: "Unauthorised" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Unauthorised" });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
