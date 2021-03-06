# Pool Manager

## **Table of Contents**

- [About the Project](#about-the-project)
  - [Background](#background)
  - [Current System](#current-system)
  - [Solution](#solution)
  - [Made By](#made-by)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prequisities](#prequisities)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
  - [Creating a New Season](#creating-a-new-season)
  - [Deleting a Season](#deleting-a-season)
  - [Submitting Results](#submitting-results)
  - [Editing a Submitted Result](#editing-a-submitted-results)
  - [Adding a Player During a Season](#adding-a-player-during-a-season)
  - [Removing a Player During a Season](#removing-a-player-during-a-season)
  - [Viewing Current League Tables and Results](#viewing-current-league-tables-and-results)
  - [Arranging Fixtures](#arranging-fixtures)
  - [Tracking Joining Fees and Declaring Payments](#tracking-joining-fees-and-declaring-payments)
  - [Achievements](#achievements)
  - [Viewing Your Personalised Stats for Current and Past Seasons](#viewing-your-personalised-stats-for-current-and-past-seasons)
  - [Closing a Season](#closing-a-season)
  - [Playoffs](#playoffs)
- [General Information](#general-information)
  - [League Table](#league-table)
  - [Results](#results)
- [Acknowledgements](#acknowledgements)

## **About the Project**

### **Background**

This is an intern project created in order to gain experience in the workplace and to develop skills required for work life.

The company which we were working for, Nonlinear Dynamics, have a pool league running in the office where employees can play each other at 8-ball and 9-ball pool and compete for the league title.

### **Current System**

The employees currently use a spreadsheet to record all the results, view the league table, record payments, and create new seasons. A Trello board is used to arrange fixtures, and a Slack channel is where score updates are posted manually.

### **Solution**

The product which we have created solves the problems that the users once had with their spreadsheet.

One of the main problems faced was how manual each process was - after playing a match, one of the players would have to input the score into their spreadsheet, then update the league table, then post a message in the relevant Slack channel to inform others of the result. With this new system, the user can input a score and everything is updated automatically: the score is available to view on the app, the league table changes, and a message is posted automatically to the Slack channel.

In addition to fixing the problems of the old system, this product has extra features such as achievements, stats, form, and user profiles.

### **Made By**

- Matthew Pollard - GitHub - [github.com/POLYGON98](https://github.com/POLYGON98)
- Michael Putra - GitHub - [github.com/michaelsurya](https://github.com/michaelsurya)
- Natalie Hargreaves - GitHub -[github.com/nhargreaves](https://github.com/nhargreaves)

### **Built With:**

- React
- Node JS
- MSSQL

## **Getting Started**

### **Prequisities**

To run the application the following is required:

- npm 6.9.0 or later

If you have already have npm installed, you can update by typing the following into your terminal:

### `npm install npm@latest -g`

### **Auth0 Setup**

```diff
! This setup is required for all the features to work
```

##### PART 1 -CLIENT-

1.  Go to https://auth0.com/ and create an account.
2.  Create your tenant and note down your **tenant domain**. (Something like **dev-jo-ek7-n.auth0.com** )
3.  On the side nav bar go to **application** and create a new **Single Page Web Applications**
4.  Choose **React** as the technology
5.  Go to the setting of your new app and note down the **Client ID**
6.  Scroll down and set the following:
    > Allowed Callback URLs: http://localhost:3000/callback
    >
    > Allowed Web Origins: http://localhost:3000
    >
    > Allowed Logout URLs: http://localhost:3000/
7.  Now go to the **client** folder and open **.env** file
8.  Set **REACT_APP_DOMAIN** to your **tenant domain** and **REACT_APP_CLIENT_ID** to your **CLIENT ID**
    > **.env** file should look something like this:
    >
    > REACT_APP_DOMAIN = dev-q70ogh1b.eu.auth0.com
    >
    > REACT_APP_CLIENT_ID = R5L9Qjuce2d4baKs1zfiP6JK9SWjkSA5

##### PART 2 -BACKEND-

1.  In your Auth0 dashboard go to the **APIs** section
2.  Click the **Auth0 Management API**
3.  Go to the **API Explorer** and then click Create and **Authorize Test Application**
4.  Now go back to the **Application** section and you should see **API Explorer Application** on your applications list
5.  Click the **API Explorer Application** and go to **Settings**
6.  Note down the **domain**, **Client ID** and **Client Secret**
7.  Navigate to the Start menu and type **env** into the search bar and click on **Edit environment variables for your account**
8.  Now create the following new variables by clicking **New...**:
    > CASE SENSITIVE!
    >
    > CLIENT_ID = Your Client ID (ex: eKibnMg57hfzscymY5b91KLeRsCPI0P1)
    >
    > CLIENT_SECRET = Your Client Secret (ex: zQnSA-eweUgb7cPU0x5qpc5FGcdioHJHPiX1c9BXtD_aw2VZLictvovWyF7_pSim)
    >
    > DOMAIN = Your Domain (ex: dev-jo-ek7-n.auth0.com)
9.  Restart your IDE
10. That's it! You are all set

### **Installation**

1. Go to both **client** and **backend** folder to install npm packages

   ### `npm install`

### **Running the Application**

In order to run the application on localhost, the following will need to be run from the terminal in both the client and backend directories:

> `cd ./backend`
>
> `npm start`

> `cd ./client`
>
> `npm start`

A browser should open at [http://localhost:3000](http://localhost:3000) and the app should load

## **Usage**

The web application can be used to perform many tasks:

- Creating a new season
- Deleting a season
- Submitting results
- Editing a submitted result
- Adding a player during a season
- Removing a player during a season
- Viewing current league tables and results
- Arranging fixtures
- Tracking joining fees and declaring payments
- Achievements
- Viewing your personalised stats for current and past seasons
- Closing a season
- Playoffs

### **Creating a New Season**

This can be done my first signing into your account and then navigating to either 8-Ball or 9-Ball depending on which season you would like to create.

After making a selection, you can visit the 'All Seasons' tab where you are presented with an 'Add new season' button. When this is clicked, a menu appears on screen allowing you to give the new season a reasonable number.

You are also presented with all the players that are registered in the system. You can remove any of these players from the new season by clicking the cross icon to the right of their name.

To add a player to the list, click 'Add player' and a new drop-down menu will appear for you to select a name.

Once you are satisfied with the details of the new season, click 'Create season' to finalise. The pop up window will close and your newly created season will now be visible in the list. A league table and fixtures are created automatically and can be viewed by clicking on the season in the list or by visiting the 'Current Season' tab.

### **Deleting a Season**

Deleting a season requires an **admin** account.

To delete a season, navigate to the 'All Seasons' page where you can see all created seasons.

Next to each season is a small cross. Click this to delete the corresponding season. An alert will appear asking for you to confirm your actions, click 'OK' and the season will be deleted along with all the joining fees for that season.

### **Submitting Results**

This is done after a fixture has been played and is achieved by navigating to the relevant season through the 'All Seasons' tab. If the season you are submitting a result for is the most recent season in that particular game type, you can just click 'Current Season' and this will take you to the correct view.

From here, you will find a 'Submit Result' section in the lower left where you can select your name if it hasn't been already, and the fixture you wish to submit a result for. After selecting a fixture, three result options will appear, two for the two players involved, and one draw.

When you are happy with the details, click 'Submit Result' and this will update the league table and fixtures.

### **Editing a Submitted Result**

Editing a result can be done though the 'Current Season' by clicking on the large red button on the right saying 'Edit Submitted Result'.

When this is clicked, a form will appear with your name in the first drop-down list selected. However, if you are signed into an admin account, this drop-down list will have 'ALL' selected. The fixture drop-down below it contains all the played fixtures; simply click the fixture you wish to edit the result of and the previous result will appear below. To edit the result just click another radio button.

After this, click 'Submit Result' and the league table will be updated accordingly. Unfortunately, the form doesn't update when a result has been edited. However, the positioning in the legaue table will still work as expected.

### **Adding a Player During a Season**

Adding a player requires an **admin** account.

To add a player, navigate to an active season and you will see an 'add new player' button underneath the league table. When this is clicked a small form will appear with a drop-down list. In this list are all the registered profiles that are not in the current season. Once you have found the player who you would like to add, select them and click 'Confirm'.

This process will automatically generate new fixtures to include the new player. However, this is slightly buggy as certain players may now be scheduled to play two games in one round.

### **Removing a Player During a Season**

Removing a player requires an **admin** account.

When hovering over a row in the league table of an active season, you will be able to see a small cross in a circle at the end of the row. Clicking this bring up an alert asking for confirmation.

Once you confirm, the player will be removed from the season and all points given from the removed player's played fixtures will be removed. The player's fixtures will also no longer show in the 'view fixtures' section on the right of the page.

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

To reset the transaction form, click 'Clear' and to close the form without submitting, click 'Cancel'.

### **Achievements**

Achievements are located on the 'Hall of Fame' page. This is where you can view which player has been awarded each achievement. The tables are split into eight and nine ball and have the following achievements:

- Top Player (Highest win percentage)
- Best Season (Most points in one season)
- 4.0 GPA (Highest points per season)
- Average (Highest draw percentage)
- Dedicated (Most games played)
- Dr. Punctual (Fewest late fixtures)
- The Train (Longest winning streak)
- Scrappy (Most wins against first place)
- Improver (Greatest improvement)
- Filthy Casual (Highest loss percentage)
- Slacker (Most late fixtures)
- In a Slump (Longest losing streak)
- Time to Retire (Biggest decline)

In the case of identical best records, it is possible for users to share an achievement. Both names will be displayed.

These tables are updated when a new result is submitted.

### **Viewing Your Personalised Stats**

If you are signed into an account that is not admin, you can view your very own stats by navigating to the 'My Dashboard' tab.

This is where you can see if you are behind on payments, your unplayed and arranged fixtures, your stats for the current season, and your all-time stats including a graph showing your position history.

The graph only shows positions for closed seasons.

### **Closing a season**

Closing a season requires an **admin** account.

You are able to close a season via the 'Current Season' page. Click the 'Close Season' button on the lower left; an alert will appear asking if you are sure you want to close the season, if so, click 'OK' and the season will not be playable anymore unless a playoff is required.

**CAUTION: This process cannot be undone. Once a season is closed, it cannot be re-opened**

If the season isn't finished and the season is closed, all remaining unplayed games will be resulted as 1-1 draws. After closing a season, if there are players on equal points in the top three, a playoff will be required.

Once a season is closed, viewing the season becomes very different as now when visiting that season, the top three players from the season are displayed at the top of the page with the final league table on the left, and the honourable mentions and fixtures on the right.

The honourable mentions are playoffs that have achieved certain accomplishments through the season. These acheivements consist of:

- Undefeated (player without any losses)
- Most drawn (player with most draws)
- Liability (player with most points against)
- Zero win (player without any wins)
- Dr. Punctual (player with fewest lates)
- Slacker (player with most lates)

When a season is closed, two crossed chequered flags are displayed next to the season name on the 'All Seasons' page.

### **Playoffs**

Starting a playoff requires an **admin** account.

When the top three positions cannot be decided due to players being on equal points with someone else, a playoff is required to decide the final standings. If this is the case, when the season is closed, a heading saying 'playoff required' will appear at the top of the screen with a 'start playoff' button underneath.

When this button is clicked, the playoff begins and new fixtures are calculated and displayed on the right. A playoff icon will also appear next to the season name in the 'All Seasons' page.

Submitting results is the same as a regular season game except that there are no draws in a playoff game.

Once all playoff games have been played, the season can be closed as usual.

## **General Information**

### **League Table**

The league table is ordered in the following manner:

1. Most points (3 for a win, 1 for a draw, 0 for a loss)
1. Most goals for
1. Fewest goals against

In the event that all the above are equal between multiple parties, the players involved will share the position until the end of the regular season where if there are still shared positions affecting the top three, a playoff will be required.

The form is displayed with the most recent submitted result on the left.

### **Results**

There are only three results possible in a regular season game:

- 2-0 win
- 1-1 draw
- 2-0 loss

In a playoff, there are only two results possible:

- 2-0 win
- 2-0 loss

No draws are possible in a playoff match and tennis rules apply where a player must win by a two game gap (e.g. 4-2, 7-5). However, when submitted, the result will only affect the points for and against in the league table and the result will go down as 2-0.

## **Acknowledgements**

- Flat Icon
- Canvas JS
- Knex JS
- Moment JS
- Chai JS
- Selenium Web Driver
- React Big Calendar
