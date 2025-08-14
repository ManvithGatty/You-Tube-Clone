// App.jsx (or your layout component)
import { useState } from "react";
import Header from "./pages/Header.jsx";
import Sidebar from "./pages/Sidebar.jsx";
import { Outlet } from "react-router-dom";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Header collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-1">
        <Sidebar collapsed={collapsed} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
