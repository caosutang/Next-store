import connectDB from "../../../utils/connectDB";
import Users from "../../../models/userModel";
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await uploadInfo(req, res);
      break;
    case "GET":
      await getUsers(req, res);
      break;
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Authorization is not valid" },
      });
    const users = await Users.find().select("-password");
    res.json({
      users,
    });
  } catch (err) {}
};

const uploadInfo = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { name, avatar } = req.body;
    const newUser = await Users.findOneAndUpdate(
      { _id: result.id },
      { name, avatar }
    );

    res.json({
      msg: "Update successful",
      user: {
        name,
        avatar,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
