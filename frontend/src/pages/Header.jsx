import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <nav className="space-x-4">
        <Link to="/" className="hover:text-red-500">Home</Link>
        <Link to="/login" className="hover:text-red-500">Login</Link>
        <Link to="/register" className="hover:text-red-500">Register</Link>
      </nav>
    </header>
  );
}
