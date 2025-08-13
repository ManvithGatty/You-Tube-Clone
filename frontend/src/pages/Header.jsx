import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice.js";
import { useState } from "react";
import { MdMenu, MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
  e.preventDefault();
  if (search.trim()) {
    navigate(`/search/${encodeURIComponent(search)}`);
  }
};

  return (
    <header className="bg-white shadow-sm px-4 py-2 flex items-center justify-between sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-200 rounded-full">
          <MdMenu size={24} />
        </button>
        <Link to="/" className="flex items-center space-x-1">
          <img
            src="https://img.icons8.com/color/96/youtube-play.png"
            alt="YouTube"
            className="h-5"
          />
          <span className="text-lg font-bold text-gray-800">YouTube</span>
        </Link>
      </div>

      {/* Search Bar */}
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
          <MdSearch size={20} />
        </button>
      </form>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {user.channelId && (
              <Link
                to={`/channel/${user.channelId}`}
                className="text-sm border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
              >
                My Channel
              </Link>
            )}
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
              Login
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
