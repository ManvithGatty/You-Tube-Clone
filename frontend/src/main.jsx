import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import "./pages/style.css";
import App from "./App.jsx";

// Lazy load pages
const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const VideoPlayer = lazy(() => import("./pages/VideoPlayer.jsx"));
const ChannelPage = lazy(() => import("./pages/ChannelPage.jsx"));
const SearchResults = lazy(() => import("./pages/SearchResults.jsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Layout
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "video/:id", element: <VideoPlayer /> },
      { path: "channel/:id", element: <ChannelPage /> },
      { path: "/search/:query", element: <SearchResults /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </StrictMode>
);
