import React from "react";
import Header from "./Header";
import SubNavBar from "./SubNavBar";

const Fixtures = () => {
  return (
    <div className="fixtures">
      <Header />
      <SubNavBar current="Fixtures" />
      <div className="content">
        <form>
          <input type="text" id="searchName" />
          <button type="button" id="searchButton">
            Search
          </button>
        </form>
      </div>
    </div>
  );
};
export default Fixtures;
