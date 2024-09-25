import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const search = (e) => {
    e.preventDefault();

    // set the url parameters as what the search term was
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    // set the search term to what url params were
    const urlParams = new URLSearchParams(location.search);
    const searchTermUrl = urlParams.get("searchTerm");
    if (searchTermUrl) {
      setSearchTerm(searchTermUrl);
    }
  }, [location.search]);

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
        <form
          className="bg-amber-50 p-2 rounded-lg flex items-center"
          onSubmit={search}
        >
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-amber-500" />
          </button>
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

          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="profilePic"
                className="rounded-full h-7 w-7 object-cover"
              />
            ) : (
              <li className="inline text-amber-700 hover:underline hover:text-red-600">
                Login
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
