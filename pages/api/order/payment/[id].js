import connectDB from "../../../../utils/connectDB";
import auth from "../../../../middleware/auth";
import Orders from "../../../../models/orderModal";

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
    if (result.role === "user") {
      const { id } = req.query;
      const { paymentId } = req.body;

      await Orders.findOneAndUpdate(
        { _id: id },
        {
          paid: true,
          paymentId,
          method: "Paypal",
          dateOfPayment: new Date().toISOString(),
        }
      );
      res.json({
        msg: "Payment success.",
      });
    }
  } catch (e) {
    return res.status(500).json({ err: e.message });
  }
};
