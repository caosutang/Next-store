import connectDB from "../../../utils/connectDB";
import Categories from "../../../models/categoriesModal";
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getCategories(req, res);
      break;
    case "POST":
      await createCategory(req, res);
      break;
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Categories.find();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      res.status(400).json({ err: "Authorization is invalid" });
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ err: "Name can not be left blank" });

    const newCategory = await Categories({ name });
    await newCategory.save();
    res.json({
      msg: "Success! Created a new category",
      newCategory,
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
