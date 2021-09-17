import React, { useEffect, useRef } from "react";
import { postData } from "../utils/fetchData";

const PaypalBtn = ({ total, address, mobile, state, dispatch }) => {
  const refPaypalBtn = useRef();
  const { cart, auth } = state;
  useEffect(() => {
    paypal
      .Buttons({
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: total,
                },
              },
            ],
          });
        },
        onApprove: function (data, actions) {
          return actions.order.capture().then(function (details) {
            dispatch({
              type: "NOTIFY",
              payload: { loading: true },
            });
            postData(
              "order",
              { address, mobile, cart, total },
              auth.token
            ).then((res) => {
              if (res.err)
                return dispatch({
                  type: "NOTIFY",
                  payload: { error: res.err },
                });
              dispatch({ type: "ADD_CART", payload: [] });
              return dispatch({
                type: "NOTIFY",
                payload: { success: res.msg },
              });
            });
          });
        },
      })
      .render(refPaypalBtn.current);
  }, []);
  return <div ref={refPaypalBtn}></div>;
};

export default PaypalBtn;
