import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-bold my-7 text-amber-700">
        Signup
      </h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter Username"
          className="border p-3 rounded-lg bg-amber-50 focus:outline-none"
          id="username"
        />
        <input
          type="text"
          placeholder="Enter Email"
          className="border p-3 rounded-lg bg-amber-50 focus:outline-none"
          id="email"
        />{" "}
        <input
          type="text"
          placeholder="Enter Password"
          className="border p-3 rounded-lg bg-amber-50 focus:outline-none"
          id="password"
        />
        <button className="bg-amber-700 text-white p-3 px-10 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 max-w-48 self-center">
          Register
        </button>
      </form>
      <div className="flex gap-1 mt-5">
        <p className="text-amber-700">Have an account?</p>
        <Link to={"/login"}>
          <span className="text-cyan-700">Sign In</span>
        </Link>
      </div>
    </div>
  );
}
