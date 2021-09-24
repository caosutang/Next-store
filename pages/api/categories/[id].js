import connectDB from "../../../utils/connectDB";
import Categories from "../../../models/categoriesModal";
import Products from "../../../models/productModel";
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await updateCategory(req, res);
      break;
    case "DELETE":
      deleteCategory(req, res);
      break;
  }
};

const updateCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      res.status(400).json({ err: "Authorization is invalid" });
    const { id } = req.query;
    const { name } = req.body;

    const newCategory = await Categories.findOneAndUpdate(
      { _id: id },
      { name }
    );
    res.json({
      msg: "Success! Updated a new category",
      category: {
        ...newCategory._doc,
        name,
      },
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      res.status(400).json({ err: "Authorization is invalid" });
    const { id } = req.query;
    const product = await Products.findOne({ category: id });
    if (product) {
      return res
        .status(400)
        .json({ err: "Please delete all products with a relationship" });
    }
    await Categories.findByIdAndDelete({ _id: id });
    res.json({
      msg: "Success! Delete a category",
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
