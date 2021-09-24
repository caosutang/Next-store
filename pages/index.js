import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { DataContext } from "../store/GlobalState";
import { getData } from "../utils/fetchData";
import ProductItem from "../components/product/ProductItem";
import filterSearch from "../utils/filterSearch";
import Filter from "../components/Filter";

const Home = (props) => {
  const router = useRouter();
  const [products, setProducts] = useState(props.product);
  const [state, dispatch] = useContext(DataContext);

  const { auth } = state;
  const [isCheck, setIsCheck] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setProducts(props.product);
  }, [props.product]);

  useEffect(() => {
    if (Object.keys(router.query).length === 0) {
      setPage(1);
    }
  }, [router.query]);

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

  const handleLoadmore = () => {
    setPage(page + 1);
    filterSearch({ router, page: page + 1 });
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

      <Filter state={state}></Filter>

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

      {props.result < page * 3 ? (
        ""
      ) : (
        <button
          className="btn btn-outline-info d-block mx-auto"
          onClick={handleLoadmore}
        >
          Load more
        </button>
      )}
    </div>
  );
};

export async function getServerSideProps({ query }) {
  const page = query.page || 1;
  const category = query.category || "all";
  const sort = query.sort || "";
  const search = query.search || "all";

  const res = await getData(
    `product?limit=${
      page * 3
    }&category=${category}&sort=${sort}&title=${search}`
  );
  return {
    props: {
      product: res.products,
      result: res.result,
    },
  };
}

export default Home;
