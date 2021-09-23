import { useState, useContext } from "react";
import Head from "next/head";

import { DataContext } from "../store/GlobalState";
import { getData } from "../utils/fetchData";
import ProductItem from "../components/product/ProductItem";

const Home = ({ productProps }) => {
  const [products, setProducts] = useState(productProps);
  const [state, dispatch] = useContext(DataContext);

  const { auth } = state;
  const [isCheck, setIsCheck] = useState(false);

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };

  const handleCheckALL = (id) => {
    products.forEach((product) => {
      product.checked = !isCheck;
    });

    setProducts([...products]);
    setIsCheck(!isCheck);
  };

  const handleDeleteALL = () => {
    let deleteArr = [];
    products.forEach((product) =>
      deleteArr.push({
        data: "",
        id: product._id,
        title: "Delete all selected products?",
        type: "DELETE_PRODUCT",
      })
    );
    dispatch({ type: "ADD_MODAL", payload: deleteArr });
  };

  return (
    <div className="home_page">
      <Head>
        <title>Home Page</title>
      </Head>
      {auth.user && auth.user.role === "admin" && (
        <div
          className="delete_all btn btn-danger mt-2"
          sytle={{ marginBottom: "-10px" }}
        >
          <input
            type="checkbox"
            checked={isCheck}
            style={{
              width: "25px",
              height: "25px",
              transform: "translateY(8px)",
            }}
            onChange={handleCheckALL}
          />
          <button
            className="btn btn-danger ml-2"
            data-toggle="modal"
            data-target="#exampleModal"
            onClick={handleDeleteALL}
          >
            DELETE ALL
          </button>
        </div>
      )}

      <div className="products">
        {products.length === 0 ? (
          <h2>No products</h2>
        ) : (
          products.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              handleCheck={handleCheck}
            ></ProductItem>
          ))
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const res = await getData("product");
  return {
    props: {
      productProps: res.products,
      result: res.result,
    },
  };
}

export default Home;
