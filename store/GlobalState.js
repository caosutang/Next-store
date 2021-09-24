import { createContext, useEffect, useReducer } from "react";
import reducers from "./Reducers";
import { getData } from "../utils/fetchData";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const initialState = {
    notify: {},
    auth: {},
    cart: [],
    modal: [],
    orders: [],
    users: [],
    categories: [],
  };
  const [state, dispatch] = useReducer(reducers, initialState);
  const { cart, auth } = state;

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      getData("auth/accessToken").then((res) => {
        if (res.error) return localStorage.removeItem("firstLogin");
        dispatch({
          type: "AUTH",
          payload: {
            token: res.accessToken,
            user: res.user,
          },
        });
      });
    }
    getData("categories").then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      dispatch({ type: "ADD_CATEGORIES", payload: res.categories });
    });
  }, []);

  useEffect(() => {
    const __next_cart01 = JSON.parse(localStorage.getItem("__next__cart01"));
    if (__next_cart01) dispatch({ type: "ADD_CART", payload: __next_cart01 });
  }, []);

  useEffect(() => {
    localStorage.setItem("__next__cart01", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (auth.token) {
      getData("order", auth.token).then((res) => {
        if (res.error) {
          return dispatch({ type: "NOTIFY", payload: { error: res.error } });
        }
        dispatch({ type: "ADD_ORDERS", payload: res.orders });
      });
      if (auth.user.role === "admin") {
        getData("user", auth.token).then((res) => {
          if (res.error) {
            return dispatch({ type: "NOTIFY", payload: { error: res.error } });
          }
          dispatch({ type: "ADD_USERS", payload: res.users });
        });
      }
    } else {
      dispatch({ type: "ADD_ORDERS", payload: [] });
      dispatch({ type: "ADD_USERS", payload: [] });
      dispatch({ type: "ADD_CATEGORIES", payload: [] });
    }
  }, [auth.token]);
  return (
    <DataContext.Provider value={[state, dispatch]}>
      {children}
    </DataContext.Provider>
  );
};
