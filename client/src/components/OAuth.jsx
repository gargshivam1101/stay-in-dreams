import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOAuthClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();
      dispatch(loginSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("Error while Google Auth", error);
    }
  };
  return (
    <button
      onClick={handleOAuthClick}
      type="button"
      className="bg-red-700 text-white p-3 px-10 rounded-lg uppercase hover:opacity-95 max-w-72 self-center"
    >
      Continue with Google
    </button>
  );
}
