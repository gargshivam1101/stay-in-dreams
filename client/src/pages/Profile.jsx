import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-bold my-7 text-amber-700 mb-10">
        Profile
      </h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.avatar}
          alt="profile pic"
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center"
        />
        <input
          type="text"
          id="username"
          placeholder="Update Username"
          className="border p-3 rounded-lg bg-amber-50 focus:outline-none"
        />
        <input
          type="text"
          id="email"
          placeholder="Update Email"
          className="border p-3 rounded-lg bg-amber-50 focus:outline-none"
        />
        <input
          type="password"
          id="password"
          placeholder="Update Password"
          className="border p-3 rounded-lg bg-amber-50 focus:outline-none"
        />
        <button className="bg-amber-700 text-white p-3 px-10 rounded-lg uppercase hover:opacity-95 disabled:opacity-70 max-w-72 self-center">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-amber-700 cursor-pointer">Delete account</span>
        <span className="text-amber-700 cursor-pointer">Logout</span>
      </div>
    </div>
  );
}
