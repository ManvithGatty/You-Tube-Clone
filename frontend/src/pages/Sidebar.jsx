import { Link } from "react-router-dom";
import { MdHome, MdWhatshot, MdSubscriptions, MdVideoLibrary, MdHistory } from "react-icons/md";

export default function Sidebar() {
  return (
    <aside className="w-48 bg-white border-r min-h-screen p-4 space-y-4">
      <Link to="/" className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded">
        <MdHome size={20} />
        <span>Home</span>
      </Link>
      <div className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded">
        <MdWhatshot size={20} />
        <span>Trending</span>
      </div>
      <div className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded">
        <MdSubscriptions size={20} />
        <span>Subscriptions</span>
      </div>
      <div className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded">
        <MdVideoLibrary size={20} />
        <span>Library</span>
      </div>
      <div className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded">
        <MdHistory size={20} />
        <span>History</span>
      </div>
    </aside>  
  );
}
