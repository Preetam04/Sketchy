import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },

  {
    path: "/room/:roomId",
    Component: Room,
  },
]);

export default router;
