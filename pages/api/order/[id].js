import connectDB from "../../../utils/connectDB";
import auth from "../../../middleware/auth";
import Orders from "../../../models/orderModal";

connectDB();
export default async (req, res) => {
  switch (req.method) {
    case "PATCH":
      await paymentOrder(req, res);
      break;
  }
};

const paymentOrder = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { id } = req.query;
    console.log(id);

    await Orders.findOneAndUpdate(
      { _id: id },
      {
        paid: true,
        dateOfPayment: new Date().toISOString(),
      }
    );
    res.json({
      msg: "Payment success.",
    });
  } catch (e) {
    return res.status(500).json({ err: e.message });
  }
};
