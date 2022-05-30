const User = require("../models/User");
const Session = require("../models/Session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  //REGISTER
  registerUser: async (req, res) => {
    const isExist = await User.findOne({ email: req.body.email });
    if (isExist) {
      return res.status(500).json({ error: "Email đã được đăng ký!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(req.body.password, salt);
    //Create new user
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashed,
      isAdmin: req.body.isAdmin,
    });

    //Save user to DB
    const user = await newUser.save();
    const sessionToken = await authController.createSessionToken(user);
    const accessToken = await authController.generateAccessToken(
      user,
      sessionToken
    );
    const { password, ...others } = user._doc;
    return res.status(200).json({ ...others, accessToken });
  },

  generateAccessToken: async (user, sessionToken) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
        sessionToken: sessionToken,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "30d" }
    );
  },

  //LOGIN
  loginUser: async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ error: "Sai mật khẩu hoặc email" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(404).json({ error: "Sai mật khẩu hoặc email" });
    }
    if (user && validPassword) {
      //Generate access token
      const sessionToken = await authController.createSessionToken(user);
      const accessToken = await authController.generateAccessToken(
        user,
        sessionToken
      );
      const { password, ...others } = user._doc;
      return res.status(200).json({ ...others, accessToken });
    }
  },

  //LOG OUT
  logOut: async (req, res) => {
    //Clear cookies when user logs out
    const sessionToken = req.user.sessionToken;
    await Session.findByIdAndDelete(sessionToken);
    return res.status(200).json("Đăng xuất thành công!");
  },

  createSessionToken: async (user) => {
    const session = new Session({ userId: user.id });
    const result = await session.save();
    return result.get("_id").toString();
  },
};

module.exports = authController;
