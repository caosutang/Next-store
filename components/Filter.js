import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import filterSearch from "../utils/filterSearch";

const Filter = ({ state }) => {
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");

  const { categories } = state;

  const router = useRouter();
  const handleChangCategory = (e) => {
    setCategory(e.target.value);
    filterSearch({ router, category: e.target.value });
  };

  const handleChangeSort = (e) => {
    setSort(e.target.value);
    filterSearch({ router, sort: e.target.value });
  };

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    filterSearch({ router, search: search ? search : "all" });
  }, [search]);

  return (
    <div className="input-group">
      <div className="input-group-prepend col-md-2 px-0 mt-2">
        <select
          value={category}
          className="custom-select text-capitalize"
          onChange={handleChangCategory}
        >
          <option value="all">All products</option>
          {categories.map((item, i) => (
            <option key={i} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <form autoComplete="off" className="mt-2 col-md-8 px-0">
        <input
          type="text"
          className="form-control"
          list="title_product"
          value={search.toLowerCase()}
          onChange={handleChangeSearch}
        />
        {/* <datalist id="title_product">
          <option value="name">Title Name</option>
        </datalist>
        <button
          className="position-absolute btn btn-info"
          type="submit"
          style={{ top: 0, right: 0, visibility: "hidden" }}
        >
          Search
        </button> */}
      </form>
      <div className="input-group-prepend col-md-2 px-0 mt-2">
        <select
          value={sort}
          onChange={handleChangeSort}
          className="custom-select text-capitalize"
        >
          <option value="-createdAt">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="-sold">Best sales</option>
          <option value="-price">Price: High - Low</option>
          <option value="price">Price: Low - High</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
