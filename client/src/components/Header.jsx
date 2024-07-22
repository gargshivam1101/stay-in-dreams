import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-amber-100 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          {/* Logo */}
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-yellow-700">StayIn</span>
            <span className="text-orange-700">Dreams</span>
          </h1>
        </Link>
        {/* Search Bar */}
        <form className="bg-amber-50 p-2 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-amber-500" />
        </form>

        {/* Menu */}
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-amber-700 hover:underline hover:text-red-600">
              Home
            </li>
          </Link>

          <Link to="/about">
            <li className="hidden sm:inline text-amber-700 hover:underline hover:text-red-600">
              About
            </li>
          </Link>

          <Link to="/login">
            <li className="inline text-amber-700 hover:underline hover:text-red-600">
              Login
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
