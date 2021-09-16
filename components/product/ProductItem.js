import Link from "next/link";

const ProductItem = ({ product }) => {
  const userLink = () => {
    return (
      <>
        <Link href={`product/${product._id}`}>
          <a className="btn btn-info" style={{ marginRight: "5px", flex: 1 }}>
            View
          </a>
        </Link>
        <button
          className="btn btn-success"
          style={{ marginLeft: "5px", flex: 1 }}
        >
          Buy
        </button>
      </>
    );
  };
  return (
    <div className="card" style={{ width: "18rem" }}>
      <img
        src={product.images[0].url}
        className="card-img-top"
        alt="Card Image cap"
      />
      <div className="card-body">
        <h5 className="card-title text-capitalize">{product.title}</h5>
        <div className="row justify-content-between mx-0">
          <h6 className="text-danger">${product.price}</h6>
          {product.inStock > 0 ? (
            <h6 className="text-danger"> In Stock: {product.inStock}</h6>
          ) : (
            <h6 className="text-danger">Out of stock</h6>
          )}
        </div>
        <p className="card-text">{product.description}</p>
        <div className="row justify-content-between mx-0">{userLink()}</div>
      </div>
    </div>
  );
};

export default ProductItem;
