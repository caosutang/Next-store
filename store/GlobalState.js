import { createContext, useEffect, useReducer } from "react";
import reducers from "./Reducers";
import { getData } from "../utils/fetchData";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
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
  }, []);
  const initialState = { notify: {}, auth: {} };
  const [state, dispatch] = useReducer(reducers, initialState);
  return (
    <DataContext.Provider value={[state, dispatch]}>
      {children}
    </DataContext.Provider>
  );
};
