import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Room from "./pages/Room";
import bg from "../images/background.png";

const App = () => {
  return (
    <div
      className={`h-screen w-screen flex justify-center `}
      style={{
        background: `url(${bg})`,
      }}
    >
      <div className="m-32 container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room" element={<Navigate to="/" />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
