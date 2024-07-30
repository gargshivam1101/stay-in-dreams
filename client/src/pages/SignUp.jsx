import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeField = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const submitForm = async (e) => {
    e.preventDefault(); // do not refresh the page

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      if (resData.success === false) {
        setError(resData.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setError(null);
      navigate("/login");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-bold my-7 text-amber-700 mb-10">
        Create an Account
      </h1>
      <form className="flex flex-col gap-4" onSubmit={submitForm}>
        <input
          type="text"
          placeholder="Enter Username"
          className="border p-3 rounded-lg bg-amber-50 focus:outline-none"
          id="username"
          onChange={changeField}
        />
        <input
          type="text"
          placeholder="Enter Email"
          className="border p-3 rounded-lg bg-amber-50 focus:outline-none"
          id="email"
          onChange={changeField}
        />{" "}
        <input
          type="password"
          placeholder="Enter Password"
          className="border p-3 rounded-lg bg-amber-50 focus:outline-none"
          id="password"
          onChange={changeField}
        />
        <button
          disabled={loading}
          className="bg-amber-700 text-white p-3 px-10 rounded-lg uppercase hover:opacity-95 disabled:opacity-70 max-w-48 self-center"
        >
          Register
        </button>
      </form>
      <div className="flex gap-1 mt-5">
        <p className="text-amber-700">Have an account?</p>
        <Link to={"/login"}>
          <span className="text-cyan-700">Sign In</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5 font-semibold">{error}</p>}
    </div>
  );
}
