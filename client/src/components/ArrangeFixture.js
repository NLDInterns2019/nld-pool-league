import React from "react";

const ArrangeFixture = () => {
  return (
    <div className="arrangeFixture">
      <h3>Arrange Fixture</h3>
      <form>
        <label>Select your name:</label>
        <select>
          <option value="name">Name</option>
          <option value="option1">Steve</option>
          <option value="option2">Chris</option>
          <option value="option3">Matthew</option>
          <option value="option4">Michael</option>
          <option value="option5">Natalie</option>
        </select>
        <br />
        <label>Select your opponent:</label>
        <select>
          <option value="name">Name</option>
          <option value="option1">Steve</option>
          <option value="option2">Chris</option>
          <option value="option3">Matthew</option>
          <option value="option4">Michael</option>
          <option value="option5">Natalie</option>
        </select>
        <br />
        <label>Day:</label>
        <select>
          <option value="monday">Monday</option>
          <option value="tuesday">Tuesday</option>
          <option value="wednesday">Wednesday</option>
          <option value="thursday">Thursday</option>
          <option value="friday">Friday</option>
        </select>
        <br />
        <label>Time:</label>
        <select>
          <option value="11:00">11:00</option>
          <option value="11:15">11:15</option>
          <option value="11:30">11:30</option>
          <option value="11:45">11:45</option>
          <option value="12:00">12:00</option>
          <option value="12:15">12:15</option>
          <option value="12:30">12:30</option>
          <option value="12:45">12:45</option>
          <option value="13:00">13:00</option>
          <option value="13:15">13:15</option>
          <option value="13:30">13:30</option>
          <option value="13:45">13:45</option>
          <option value="14:00">14:00</option>
        </select>
        <br />
        <div className="arrangeFixtureBtn">
          <button type="button">Arrange</button>
        </div>
      </form>
    </div>
  );
};

export default ArrangeFixture;
