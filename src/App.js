import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css"; // Import your CSS file
import Home from "./module/Home";
import RepoDetails from "./module/RepoDetails";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/repo/:username/:reponame" element={<RepoDetails />} />
      </Routes>
    </Router>
  );
}
