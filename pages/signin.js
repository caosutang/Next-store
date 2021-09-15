import React, { useContext, useState } from "react";
import Head from "next/head";
import Link from "next/link";

import valid from "../utils/valid";
import { DataContext } from "../store/GlobalState";
import { postData } from "../utils/fetchData";
import Cookie from "js-cookie";

const Signin = () => {
  const initialState = { email: "", password: "" };
  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;
  const [state, dispatch] = useContext(DataContext);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "NOTIFY", payload: { loading: true } });

    const res = await postData("auth/login", userData);
    if (res.err) {
      return dispatch({ type: "NOTIFY", payload: { err: res.err } });
    }
    dispatch({ type: "NOTIFY", payload: { success: res.msg } });

    dispatch({
      type: "AUTH",
      payload: {
        token: res.accessToken,
        user: res.user,
      },
    });
    Cookie.set("RefreshToken", res.refreshToken, {
      path: "api/auth/accessToken",
      expires: 7,
    });
    localStorage.setItem("firstLogin", true);
  };

  return (
    <div>
      <Head>
        <title> SignIn Page</title>
      </Head>

      <form
        className="mx-auto my-4"
        style={{ maxWidth: "500px" }}
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label htmlFor="inputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="inputEmail1"
            name="email"
            value={email}
            aria-describedby="emailHelp"
            onChange={handleChangeInput}
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="inputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="inputPassword1"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChangeInput}
          />
        </div>
        <button type="submit" className="btn btn-dark w-180">
          Login
        </button>

        <p className="my-2">
          You dont have an account ?
          <Link href="/register">
            <a style={{ color: "crimson" }}> Register</a>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signin;
