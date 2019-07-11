import React from "react";

const ViewYourFixtures = () => {
  return (
    <div className="viewYourFixtures">
      <h3>View Your Fixtures</h3>
      <form>
        <label>Select a season:</label>
        <select>
          <option selected disabled value="season">
            Season
          </option>
          <option value="option1">Season 1</option>
          <option value="option2">Season 2</option>
        </select>
        <br />

        <label>Select your name:</label>
        <select>
          <option value="name" selected disabled>
            Name
          </option>
          <option value="option1">Chris</option>
          <option value="option2">Steve</option>
          <option value="option3">Michael</option>
          <option value="option4">Matthew</option>
          <option value="option5">Natalie</option>
        </select>
        <div className="viewBtn">
          <button type="button">View</button>
        </div>
      </form>
    </div>
  );
};

export default ViewYourFixtures;
