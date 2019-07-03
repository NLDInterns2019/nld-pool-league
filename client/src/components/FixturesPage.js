import React from "react";
import Header from "./Header";
import SubNavBar from "./SubNavBar";
import SubmitScoreForm from "./SubmitScoreForm";
import ViewYourFixtures from "./ViewYourFixtures";
import ArrangeFixture from "./ArrangeFixture";

const FixturesPage = () => {
  return (
    <div className="fixtures">
      <Header />
      <SubNavBar />
      <div className="content">
        <div className="contentLeft">
          <ViewYourFixtures />
        </div>
        <div className="contentRight">
          <SubmitScoreForm />
          <ArrangeFixture />
        </div>
      </div>
    </div>
  );
};
export default FixturesPage;
