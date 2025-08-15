import { Link } from "react-router-dom";
import {
  MdHome,
  MdSubscriptions,
  MdVideoLibrary,
  MdHistory,
  MdWatchLater,
  MdThumbUp,
  MdPlaylistPlay,
  MdTrendingUp,
  MdSportsEsports,
  MdMusicNote,
  MdMovie,
  MdSchool,
  MdLiveTv,
} from "react-icons/md";

export default function Sidebar({ collapsed }) {
  const menuItems = [
    { name: "Home", icon: <MdHome size={22} />, link: "/" },
    { name: "Trending", icon: <MdTrendingUp size={22} /> },
    { name: "Subscriptions", icon: <MdSubscriptions size={22} /> },
    { name: "Library", icon: <MdVideoLibrary size={22} /> },
    { name: "History", icon: <MdHistory size={22} /> },
    { name: "Watch Later", icon: <MdWatchLater size={22} /> },
    { name: "Liked Videos", icon: <MdThumbUp size={22} /> },
    { name: "Playlists", icon: <MdPlaylistPlay size={22} /> },
  ];

  const exploreItems = [
    { name: "Music", icon: <MdMusicNote size={22} /> },
    { name: "Gaming", icon: <MdSportsEsports size={22} /> },
    { name: "Movies", icon: <MdMovie size={22} /> },
    { name: "Learning", icon: <MdSchool size={22} /> },
    { name: "Live", icon: <MdLiveTv size={22} /> },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-60"
      } bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto transition-all duration-300`}
    >
      <div className="py-2">
        {menuItems.map((item, idx) =>
          item.link ? (
            <Link
              key={idx}
              to={item.link}
              className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-100"
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ) : (
            <div
              key={idx}
              className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </div>
          )
        )}

        <hr className="my-2" />

        {!collapsed && (
          <h3 className="px-4 py-1 text-sm font-semibold text-gray-500 uppercase">
            Explore
          </h3>
        )}
        {exploreItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-4 px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </div>
        ))}
      </div>
    </aside>
  );
}
