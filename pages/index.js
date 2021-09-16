import { useState } from "react";
import Head from "next/head";
import { getData } from "../utils/fetchData";
import ProductItem from "../components/product/ProductItem";

const Home = ({ productProps }) => {
  const [products, setProducts] = useState(productProps);
  return (
    <div className="products">
      <Head>
        <title>Home Page</title>
      </Head>
      {products.length === 0 ? (
        <h2>No products</h2>
      ) : (
        products.map((product) => (
          <ProductItem key={product._id} product={product}></ProductItem>
        ))
      )}
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
