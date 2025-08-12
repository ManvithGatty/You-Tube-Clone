import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice.js";
import { useState } from "react";

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // later we'll navigate to a search results page
    console.log("Search query:", search);
  };

  return (
    <header className="bg-white shadow-sm px-4 py-2 flex items-center justify-between sticky top-0 z-50">
      {/* Left Section - Hamburger + Logo */}
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-200 rounded-full">
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <Link to="/" className="flex items-center space-x-1">
          <img src="/youtube-logo.png" alt="YouTube" className="h-5" />
          <span className="text-lg font-bold text-gray-800">YouTube</span>
        </Link>
      </div>

      {/* Middle Section - Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-1 max-w-xl mx-4">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-l-full px-4 py-1 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-full px-4 hover:bg-gray-200"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387z" />
          </svg>
        </button>
      </form>

      {/* Right Section - User Profile */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {user.avatar && (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-sm">{user.username}</span>
            <button
              onClick={() => dispatch(logout())}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm border border-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-50"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm border border-green-500 text-green-500 px-3 py-1 rounded hover:bg-green-50"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
