import React from "react";
import Header from "./Header";
import SubNavBar from "./SubNavBar";
import SubmitScoreForm from "./SubmitScoreForm";
import ViewYourFixtures from "./ViewYourFixtures";

const FixturesPage = () => {
  return (
    <div className="fixtures">
      <Header />
      <SubNavBar current="Fixtures" />
      <div className="content">
        <div className="contentLeft">
          <ViewYourFixtures />
        </div>
        <div className="contentRight">
          <SubmitScoreForm />
        </div>
      </div>
    </div>
  );
};
export default FixturesPage;
