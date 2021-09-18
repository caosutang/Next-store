import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import { DataContext } from "../../store/GlobalState";
import OrderDetail from "../../components/OrderDetail";

const DetailOrder = () => {
  const [state, dispatch] = useContext(DataContext);
  const { orders, auth } = state;
  const [orderDetail, setOrderDetail] = useState([]);

  const router = useRouter();
  useEffect(() => {
    const newArr = orders.filter((order) => order._id === router.query.id);
    setOrderDetail(newArr);
  }, [orders]);

  return (
    <div className="my-3">
      <Head>
        <title> Detail order </title>
      </Head>
      <div>
        <button className="btn btn-dark" onClick={() => router.back()}>
          <i className="fas fa-long-arrow-alt-left" aria-hidden="true"></i> Go
          Back
        </button>
      </div>
      <OrderDetail orderDetail={orderDetail} />
    </div>
  );
};

export default DetailOrder;
