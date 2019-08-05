import React from "react";
import Header from "./nav/Header";

const NotFound = () => {
  return (
    <div className="app">
      <Header />
      <div className="content">
        <h1>404: PAGE NOT FOUND!</h1>
      </div>
    </div>
  );
};

export default NotFound;
