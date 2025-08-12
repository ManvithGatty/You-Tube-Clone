import { Outlet } from "react-router-dom";
import Header from "./pages/Header.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
