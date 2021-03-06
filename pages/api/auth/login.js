import connectDB from "../../../utils/connectDB";
import Users from "../../../models/userModel";
import bcrypt from "bcrypt";
import {
  createAccessToken,
  createRefreshToken,
} from "../../../utils/generateToken";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await login(req, res);
      break;
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      res.status(400).json({ err: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ err: "Incorrect password" });
    }
    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });
    res.json({
      msg: "Login successful",
      accessToken,
      refreshToken,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        root: user.root,
      },
    });
  } catch (e) {
    res.status(500).json({ err: e.message });
  }
};
