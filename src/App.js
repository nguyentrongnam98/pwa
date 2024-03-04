import React from "react";
import { Route, Routes } from "react-router-dom";
import About from "./About";
import Home from "./Home";
import NavBar from "./Navbar";
import User from "./User";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/user" element={<User/>} />
      </Routes>
    </div>
  );
}

export default App;
