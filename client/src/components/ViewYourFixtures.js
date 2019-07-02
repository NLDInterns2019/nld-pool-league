import React from "react";

const ViewYourFixtures = () => {
  return (
    <div className="viewYourFixtures">
      <h3>View Your Fixtures</h3>
      <form>
        <label>Select your name:</label>
        <select>
          <option value="placeholder" selected="">
            Name
          </option>
          <option value="option1">Chris</option>
          <option value="option2">Steve</option>
          <option value="option3">Michael</option>
          <option value="option4">Matthew</option>
          <option value="option5">Natalie</option>
        </select>
      </form>
    </div>
  );
};

export default ViewYourFixtures;
