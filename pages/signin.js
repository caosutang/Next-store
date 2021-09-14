import Head from "next/head";
import Link from "next/link";
const Signin = () => {
  return (
    <div>
      <Head>
        <title> SignIn Page</title>
      </Head>

      <form className="mx-auto my-4" style={{ maxWidth: "500px" }}>
        <div className="form-group">
          <label htmlFor="inputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            id="inputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
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
