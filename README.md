# Pool Manager

## **Table of Contents**

---

- [About the Project](#about-the-project)
  - [Background](#background)
  - [Current System](#current-system)
  - [Solution](#solution)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prequisities](#prequisities)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
  - [Creating a Season](#creating-a-season)
  - [Submitting a Result](#submitting-a-result)
- [General Information](#general-information)
  - [League Table](#league-table)
- [Acknowledgements](#acknowledgements)

## **About the Project**

---

### **Background**

This is an intern project created in order to gain experience in the workplace and to develop skills required for work life.

The company which we were working for, Nonlinear Dynamics, have a pool league running in the office where employees can play each other at 8-ball and 9-ball pool and compete for the league title.

### **Current System**

The employees currently use a spreadsheet to record all the results, view the league table, record payments, and create new seasons. A Trello board is used to arrange fixtures, and a Slack channel is where score updates are posted manually.

### **Solution**

The product which we have created solves the problems that the users once had with their spreadsheet.

One of the main problems faced was how manual each process was - after playing a match, one of the players would have to input the score into their spreadsheet, then update the league table, then post a message in the relevant Slack channel to inform others of the result. With this new system, the user can input a score and everything is updated automatically: the score is available to view on the app, the league table changes, and a message is posted automatically to the Slack channel.

In addition to fixing the problems of the old system, this product has extra features such as achievements, stats, form, and user profiles.

### **Built With:**

- React
- Node JS
- MSSQL

## **Getting Started**

---

### **Prequisities**

To run the application the following is required:

- npm 6.9.0 or later

If you have already have npm installed, you can update by typing the following into your terminal:

### `npm install npm@latest -g`

### **Installation**

1. Install npm packages

   ### `npm install`

### **Running the Application**

In order to run the application on localhost, the following will need to be run from the terminal in both the client and backend directories:

### `npm start`

A browser should open at [http://localhost:3000](http://localhost:3000) and the app should load

## **Usage**

---

The web application can be used to perform many tasks:

- Creating a new season
- Submitting results
- Viewing current league tables and results
- Arranging fixtures
- Tracking joining fees and declaring payments
- Receiving Achievements
- Viewing your personalised stats for current and past seasons

### **Creating a Season**

This can be done my first signing into your account and then navigating to either 8-Ball or 9-Ball depending on which season you would like to create.

After making a selection, you can visit the 'All Seasons' tab where you are presented with an 'Add new season' button. When this is clicked, a menu appears on screen allowing you to give the new season a reasonable number.

You are also presented with all the players that are registered in the system. You can remove any of these players from the new season by clicking the cross icon to the right of their name.

To add a player to the list, click 'Add player' and a new drop-down menu will appear for you to select a name.

Once you are satisfied with the details of the new season, click 'Create season' to finalise. The pop up window will close and your newly created season will now be visible in the list. A league table and fixtures are created automatically and can be viewed by clicking on the season in the list or by visiting the 'Current Season' tab.

### **Submitting Results**

This is done after a fixture has been played and is achieved by navigating to the relevant season through the 'All Seasons' tab. If the season you are submitting a result for is the most recent season in that particular game type, you can just click 'Current Season' and this will take you to the correct view.

From here, you will find a 'Submit Result' section in the lower left where you can select your name if it hasn't been already, and the fixture you wish to submit a result for. After selecting a fixture, three result options will appear, two for the two players involved, and one draw. A win rewards the winner with a 2-0 victory, and a draw rewards both players with a 1-1 draw.

When you are happy with the details, click 'Submit Result' and this will update the league table and fixtures.

## **General Information**

---

### **League Table**

The league table is ordered in the following manner:

1. Most points (3 for a win, 1 for a draw, 0 for a loss)
2. Most goals for
3. Fewest goals against

In the event that all the above are equal between multiple parties, the players involved will share the position until the end of the regular season where if there are still shared positions affecting the top three, a playoff will be required.

The form is displayed with the most recent submitted result on the left.

## **Acknowledgements**

---

- Flat Icon
- Canvas JS
- Knex JS
- Moment JS
- Chai JS
- Selenium Web Driver
- React Big Calendar
