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
  - [Results](#results)
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

From here, you will find a 'Submit Result' section in the lower left where you can select your name if it hasn't been already, and the fixture you wish to submit a result for. After selecting a fixture, three result options will appear, two for the two players involved, and one draw.

When you are happy with the details, click 'Submit Result' and this will update the league table and fixtures.

### **Viewing League Table**

This is positioned on the upper left of the 'Current Season' page. It contains all players involved in the current season and is also where a player can see if others have paid their joining fee. The columns from left to right are:

- Position
- Name
- Number of games played
- Number of wins
- Number of draws
- Number of losses
- Points for
- Points against
- Form for the last five matches
- Points
- Indicator to show if the player has paid their joining fee

### **Viewing Fixtures**

You can find this on the right hand side of the 'Current Season' page. By default, the fixtures visible are your own unplayed fixtures.

To see someone else's or everyone's fixtures, select either someone else's name or 'ALL' from the name drop-down list.

To toggle whether the played fixtures are visible, click the 'Show played fixtures' checkbox and they will appear with the unplayed fixtures.

You can reset the filters to their original state by clicking the 'Clear' button

### **Arranging Fixtures**

This is located on the 'Arrange Fixtures' page. When on the page, you will be presented with a calendar with days along the top and hours split in two down the left.

To book the pool table for a half hour time slot, click in the rectangle corresponding to the time slot you would like.

You will presented with a pop-up form to fill in. This form tells you which time slot you will be booking for at the top. Fill in the form by selecting your name and your opponent's name from the respective drop-down menus. You also have the ability to book the table for games outside of the pool leagues currently running. To book a friendly or a billiards match, check the 'Friendly/Billiard' checkbox. However, if you are arranging a match that is taking place in the pool leagues, leave this box unchecked.

Once you are happy with the details of the fixture, click 'Confirm' and you will see your scheduled fixture appear in the calendar. A slack message will also be sent to your Slack channel to notify others of the match.

If you would like to change the time of a fixture you have scheduled, you can drag and drop the event to another time slot. Once dropped, the event may flash back to its original position briefly. This is expected and it will finish in its new position. A new Slack message will also be sent to notify others of the change.

### **Tracking Joining Fees and Declaring Payments**

When you are either not signed in or you are signed in as non-admin, you are able to view the statement in incoming and outgoing money from the kitty 'Kitty' page.

The overall balance is displayed at the top of the page and this changes with every transaction made. The table also displays the date a transaction was made, the exact season it relates to, the user behind it, a brief description, and the value the transaction was for.

If you are signed in as admin, you are able to view outstanding payments on the left where all the people who haven't paid are shown with which seasons' fees are outstanding. The statement also looks slightly different to if you are not admin; it only shows the eight most recent transactions. The table can be expanded by clicking 'Show more...' and then collapsed with 'Show less...'.

When a player pays their joining fee, the admin can click on the corresponding table row to confirm that player has paid. An alert will appear asking to confirm that person has paid; click 'OK' to finalise. This new payment will automatically appear in the statement on the right and the balance will update.

To make a transaction such as buying medals, click the 'Make Transaction' button on the lower right. You will be presented with a transaction form. Select whether the transaction is credit (adding money) or debit (spending money), the type, season, enter a brief description, and the value the transaction is for. When you are happy with the details, click 'Submit' and this transaction will automatically appear in the statement.

### **Viewing Your Personalised Stats**

If you are signed into an account that is not admin, you can view your very own stats by navigating to the 'My Dashboard' tab.

This is where you can see if you are behind on payments, your unplayed and arranged fixtures, your stats for the current season, and your all-time stats including a graph showing your position history.

The graph only shows positions for closed seasons.

## **General Information**

---

### **League Table**

The league table is ordered in the following manner:

1. Most points (3 for a win, 1 for a draw, 0 for a loss)
1. Most goals for
1. Fewest goals against

In the event that all the above are equal between multiple parties, the players involved will share the position until the end of the regular season where if there are still shared positions affecting the top three, a playoff will be required.

The form is displayed with the most recent submitted result on the left.

### **Results**

There are only three results possible:

- 2-0 win
- 1-1 draw
- 2-0 loss

## **Acknowledgements**

---

- Flat Icon
- Canvas JS
- Knex JS
- Moment JS
- Chai JS
- Selenium Web Driver
- React Big Calendar
