import { Link } from "react-router-dom";
import { MdHomeFilled, MdSubscriptions } from "react-icons/md";

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r border-gray-200 p-4 space-y-4 h-screen sticky top-14">
      <nav className="space-y-2">
        <Link to="/" className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded">
          <MdHomeFilled size={22} />
          <span>Home</span>
        </Link>
        <Link to="/subscriptions" className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded">
          <MdSubscriptions size={22} />
          <span>Subscriptions</span>
        </Link>
      </nav>
    </aside>
  );
}
