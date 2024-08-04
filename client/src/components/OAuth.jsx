import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";

export default function OAuth() {
  const handleOAuthClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const res = await signInWithPopup(auth, provider);
      console.log(res);
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
