import connectDB from "../../../utils/connectDB";
import auth from "../../../middleware/auth";
import Orders from "../../../models/orderModal";
import Products from "../../../models/productModel";

connectDB();
export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await createOrder(req, res);
      break;
    case "GET":
      await getOrder(req, res);
      break;
  }
};

const createOrder = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { address, mobile, cart, total } = req.body;
    const newOrder = new Orders({
      user: result.id,
      address,
      mobile,
      cart,
      total,
    });

    cart.filter((item) => {
      return sold(item._id, item.quantity, item.inStock, item.sold);
    });

    await newOrder.save();
    res.json({
      msg: "Order successful! We will contact you to confirm the order.",
      newOrder,
    });
  } catch (e) {
    return res.status(500).json({ err: e.message });
  }
};

const sold = async (id, quantity, oldInStock, oldSold) => {
  await Products.findOneAndUpdate(
    { _id: id },
    {
      inStock: oldInStock - quantity,
      sold: quantity + oldSold,
    }
  );
};

const getOrder = async (req, res) => {
  try {
    // Auth user
    const result = await auth(req, res);
    // Find all order of user in db
    let orders;
    if (result.role !== "admin") {
      orders = await Orders.find({ user: result.id }).populate(
        "user",
        "-password"
      );
    } else {
      orders = await Orders.find().populate("user", "-password");
    }
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
