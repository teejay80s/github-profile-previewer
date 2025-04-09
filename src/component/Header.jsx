import React from "react";
import "../index.css";

const Header = ({ toggleTheme, theme }) => {
  return (
    <div className="header">
      <h1 className="title">GitHub Profile Previewer</h1>
      <button className="button" onClick={toggleTheme}>
        {theme === "light" ? "🌙" : "🌞"}
      </button>
    </div>
  );
};

export default Header;
