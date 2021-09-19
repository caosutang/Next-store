import connectDB from "../../../../utils/connectDB";
import auth from "../../../../middleware/auth";
import Orders from "../../../../models/orderModal";

connectDB();
export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await deliveredOrder(req, res);
      break;
  }
};

const deliveredOrder = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid" });

    const { id } = req.query;
    const order = await Orders.findOne({ _id: id });

    if (order.paid) {
      await Orders.findOneAndUpdate(
        { _id: id },
        {
          delivered: true,
        }
      );
      res.json({
        msg: "Update Success",
        result: {
          paid: true,
          method: order.method,
          delivered: true,
          dateOfPayment: order.dateOfPayment,
        },
      });
    } else {
      await Orders.findOneAndUpdate(
        { _id: id },
        {
          paid: true,
          method: "Receive Cash",
          delivered: true,
          dateOfPayment: new Date().toISOString(),
        }
      );
      res.json({
        msg: "Update success.",
        result: {
          paid: true,
          method: "Receive Cash",
          delivered: true,
          dateOfPayment: new Date().toISOString(),
        },
      });
    }
  } catch (e) {
    return res.status(500).json({ err: e.message });
  }
};
