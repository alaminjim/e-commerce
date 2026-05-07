const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  googleLogin,
  updateProfile,
  checkAuth,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.put("/update-profile", authMiddleware, updateProfile);
router.post("/logout", logoutUser);
router.get("/check-auth", authMiddleware, checkAuth);

module.exports = router;
