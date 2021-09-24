import Link from "next/link";
import PaypalBtn from "./paypalBtn";
import { patchData } from "../utils/fetchData";
import { updateItem } from "../store/Actions";

const OrderDetail = ({ orderDetail, state, dispatch }) => {
  const { auth, orders } = state;
  const handleDelivered = (order) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    patchData(`order/delivered/${order._id}`, null, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      const { paid, dateOfPayment, method, delivered } = res.result;
      dispatch(
        updateItem(
          orders,
          order._id,
          { ...order, paid, dateOfPayment, method, delivered },
          "ADD_ORDERS"
        )
      );
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };
  return (
    <div style={{ margin: "20px auto" }}>
      {orderDetail.map((order) => (
        <div
          key={order._id}
          className="text-uppercase my-3"
          style={{ maxWidth: "600px" }}
        >
          <h2 className="text-break">Order {order._id}</h2>
          <div className="mt4 text-secondary">
            <h4>Shipping</h4>
            <p>Name: {order.user.name}</p>
            <p>Email: {order.user.email}</p>
            <p>Address: {order.address}</p>
            <p>Mobile: {order.mobile}</p>
            <div
              className={`d-flex justify-content-between align-items-center alert ${
                order.delivered ? "alert-success" : "alert-danger"
              }`}
            >
              {order.delivered
                ? `Delivered on ${order.updatedAt}`
                : "Not delivered"}
              {auth.user.role === "admin" && !order.delivered && (
                <button
                  className="btn btn-dark text-uppercase"
                  onClick={() => handleDelivered(order)}
                >
                  Mark as delivered
                </button>
              )}
            </div>
            <h4>Payment</h4>
            {order.method && <h6>Method: {order.method}</h6>}
            {order.paymentId && <p>PaymentId: {order.paymentId}</p>}
            <div
              className={`d-flex justify-content-between align-items-center alert ${
                order.paid ? "alert-success" : "alert-danger"
              }`}
            >
              {order.paid ? `Paid ${order.updatedAt}` : "Not paid"}
            </div>
            <div>
              <h4>Order Items</h4>
              {order.cart.map((item) => (
                <div
                  className="row border-bottom mx-0 p-2 justify-content-between align-items-center"
                  key={item._id}
                  style={{ maxWidth: "550px" }}
                >
                  <img
                    src={item.images[0].url}
                    alt="Image"
                    style={{
                      width: "50px",
                      height: "45px",
                      objectFit: "cover",
                    }}
                  />
                  <h5 className="flex-fill text-secondary px-3 m-0">
                    <Link href={`/product/${item._id}`}>
                      <a>{item.title}</a>
                    </Link>
                  </h5>
                  <span className="text-info text-lowercase m-0">
                    {item.quantity} x ${item.price} = $
                    {item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {!order.paid && auth.user.role !== "admin" && (
            <div className="p-4">
              <h2 className="mb-4 text-uppercase">Total: ${order.total}</h2>
              <PaypalBtn order={order} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderDetail;
