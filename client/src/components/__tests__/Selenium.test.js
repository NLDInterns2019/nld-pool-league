import chai, { expect } from "chai";
require("chromedriver");
const { Builder, By, until } = require("selenium-webdriver");
var driver = new Builder().forBrowser("chrome").build();
driver
  .manage()
  .window()
  .maximize();
chai.use(require("chai-as-promised"));
var homepage = `http://localhost:3000/`;

describe("App", () => {
  describe("LandingPage", () => {
    beforeEach(async () => {
      await jest.setTimeout(30000);
      await driver.get(homepage);
    });

    it("should have expected title value", async () => {
      await driver.sleep(500);
      var actual = await driver.getTitle();
      var expected = "Pool Manager";
      expect(actual).to.equal(expected);
    });

    it("should navigate to the 8-ball section when 8-ball is clicked", async () => {
      await driver
        .findElement(
          By.xpath("//*[@id='eightBallLink'][@class='landingPageLink']")
        )
        .click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "8-ball/";
      expect(actual).to.contain(expected);
    });

    it("should navigate to the 9-ball section when 9-ball is clicked", async () => {
      await driver
        .findElement(
          By.xpath("//*[@id='nineBallLink'][@class='landingPageLink']")
        )
        .click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "9-ball/";
      expect(actual).to.contain(expected);
    });
  });

  describe("8-ball Seasons page navigation", () => {
    beforeEach(async () => {
      await jest.setTimeout(30000);
      await driver.get(homepage + "8-ball/seasons");
    });

    it('should say "8-ball" in the subnav bar', async () => {
      var text = await driver
        .findElement(By.xpath("//*[@class='nav']/h2"))
        .getText();
      var expected = "8-Ball";
      expect(text).to.equal(expected);
    });

    it('should navigate to the landing page when "POOL MANAGER" is clicked', async () => {
      await driver.findElement(By.xpath("//*[@class='headerLeft']/a")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage;
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 9-ball seasons page when "9-ball" is clicked', async () => {
      await driver.findElement(By.id("nineBallLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "9-ball/seasons";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 8-ball kitty when "kitty" clicked', async () => {
      await driver.findElement(By.id("KittyLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "8-ball/kitty";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the hall of fame when "Hall of Fame" clicked', async () => {
      await driver.findElement(By.id("HoFLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "8-ball/hall_of_fame";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 8-ball overview when "current season" clicked', async () => {
      await driver.findElement(By.id("currentSeasonLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "8-ball/overview/";
      expect(actual).to.contain(expected);
    });
  });

  describe("9-ball Seasons page navigation", () => {
    beforeEach(async () => {
      await jest.setTimeout(30000);
      await driver.get(homepage + "9-ball/seasons");
    });

    it('should say "9-ball" in the subnav bar', async () => {
      var text = await driver
        .findElement(By.xpath("//*[@class='nav']/h2"))
        .getText();
      var expected = "9-Ball";
      expect(text).to.equal(expected);
    });

    it("should not display 'My Dashboard' in the subnav bar", async () => {
      var actual = await driver
        .findElements(By.xpath("//*[@class='main-items']/li"))
        .then(elements => {
          return elements[1].getText();
        });
      expect(actual).to.equal("");
    });

    it('should navigate to the landing page when "POOL MANAGER" is clicked', async () => {
      await driver.findElement(By.xpath("//*[@class='headerLeft']/a")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage;
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 8-ball seasons page when "8-ball" is clicked', async () => {
      await driver.findElement(By.id("eightBallLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "8-ball/seasons";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 9-ball kitty when "kitty" clicked', async () => {
      await driver.findElement(By.id("KittyLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "9-ball/kitty";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the hall of fame when "Hall of Fame" clicked', async () => {
      await driver.findElement(By.id("HoFLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "9-ball/hall_of_fame";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 9-ball overview when "current season" clicked', async () => {
      await driver.findElement(By.id("currentSeasonLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "9-ball/overview/";
      expect(actual).to.contain(expected);
    });
  });

  describe("Signing in", () => {
    beforeEach(async () => {
      await jest.setTimeout(30000);
    });
    it("should be able to sign in", async () => {
      await driver.get(homepage);
      await driver.findElement(By.id("loginBtn")).click();
      await driver.sleep(4000);
      await driver
        .wait(until.elementLocated(By.name("username")), 5 * 1000)
        .then(element => {
          return element.sendKeys("matthew");
        });
      await driver
        .wait(until.elementLocated(By.name("password")), 5 * 1000)
        .then(element => {
          return element.sendKeys(process.env.TEST_PASSWORD);
        });
      await driver.findElement(By.className("auth0-label-submit")).click();
      await driver.wait(until.urlIs(homepage));
      var actual = await driver.getCurrentUrl();
      var expected = homepage;
      expect(actual).to.equal(expected);
    });

    it("should display all the correct nav items", async () => {
      await driver.get(homepage + "8-ball/seasons");
      var allSeasonsText = await driver
        .wait(until.elementLocated(By.id("seasonsLink")))
        .then(element => {
          return element.getText();
        });

      var currentSeasonText = await driver
        .findElement(By.id("currentSeasonLink"))
        .getText();

      var arrangeFixturesText = await driver
        .findElement(By.id("fixturesLink"))
        .getText();
      var hallOfFameText = await driver.findElement(By.id("HoFLink")).getText();
      var kittyText = await driver.findElement(By.id("KittyLink")).getText();
      var dashboardText = await driver
        .findElement(By.id("dashboardLink"))
        .getText();

      expect(allSeasonsText).to.equal("All Seasons");
      expect(currentSeasonText).to.equal("Current Season");
      expect(arrangeFixturesText).to.equal("Arrange Fixtures");
      expect(hallOfFameText).to.equal("Hall of Fame");
      expect(kittyText).to.equal("Kitty");
      expect(dashboardText).to.equal("My Dashboard");
    });
  });

  describe("Dashboard", () => {
    beforeEach(async () => {
      await jest.setTimeout(30000);
    });
    it("should be able to navigate to the dashboard page after signing in", async () => {
      await driver
        .wait(until.elementLocated(By.id("eightBallLink")), 5 * 1000)
        .then(element => {
          return element.click();
        });
      await driver.findElement(By.id("dashboardLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "8-ball/dashboard";
      expect(actual).to.equal(expected);
      await driver.sleep(1000);
    });

    it("should say the user's name at the top of the screen", async () => {
      var text = await driver
        .findElement(By.xpath("//*[@class='player-info']/h3"))
        .getText();
      var expected = "Welcome back MATTHEW";
      expect(text).to.equal(expected);
    });
  });

  describe("Signing out", () => {
    it("should be able to sign out", async () => {
      await jest.setTimeout(30000);
      await driver.findElement(By.id("signout")).click();
      await driver.sleep(1000);
    });
  });

  describe("Sign in as admin", () => {
    it("should be able to sign in with admin permissions", async () => {
      await driver.get(homepage);
      await driver.findElement(By.id("loginBtn")).click();
      await driver.sleep(4000);
      await driver
        .wait(until.elementLocated(By.name("username")), 5 * 1000)
        .then(element => {
          return element.sendKeys("admin");
        });
      await driver
        .wait(until.elementLocated(By.name("password")), 5 * 1000)
        .then(element => {
          return element.sendKeys(process.env.ADMIN_PASSWORD);
        });
      await driver.findElement(By.className("auth0-label-submit")).click();
      await driver.wait(until.urlIs(homepage));
      var actual = await driver.getCurrentUrl();
      var expected = homepage;
      expect(actual).to.equal(expected);
    });
  });

  describe("Creating a season", () => {
    beforeEach(async () => {
      await jest.setTimeout(30000);
    });

    /* affects database */
    it("should be able to create a season", async () => {
      await driver.get(homepage + "8-ball/seasons");
      await driver.sleep(500);
      var noOfSeasons = await driver
        .findElements(By.className("season-list-item"))
        .then(elements => {
          return elements.length;
        });
      await driver.findElement(By.id("addSeasonBtn")).click();
      await driver.sleep(1000);
      await driver.findElement(By.id("inputSeasonNo")).sendKeys("5000");
      await driver.sleep(1000);
      await driver.findElement(By.id("createSeasonBtn")).click();
      await driver.sleep(2000);
      var noOfSeasonsAfter = await driver
        .findElements(By.className("season-list-item"))
        .then(elements => {
          return elements.length;
        });
      expect(noOfSeasonsAfter).to.equal(noOfSeasons + 1);
    });

    it("should navigate to the current season screen when the new season is selected", async () => {
      await driver.findElement(By.id("season5000")).click();
      await driver.sleep(1000);
      var text = await driver
        .findElement(By.xpath("//*[@class='leagueTableContainer']/h3"))
        .getText();
      var expected = "Season 5000 League Table";
      expect(text).to.equal(expected);
    });
  });

  describe("Editing number of players", () => {
    /* affects database */
    it("should be able to delete a player from a season", async () => {
      await jest.setTimeout(30000);
      await driver.sleep(3000);
      var noOfPlayers = await driver
        .findElements(By.xpath("//*[@class='leagueTable']/tbody/tr"))
        .then(elements => {
          return elements.length;
        });
      await driver.findElement(By.id("delete-chrisp")).click();
      await driver.sleep(500);
      await driver
        .switchTo()
        .alert()
        .accept();
      await driver.sleep(1000);
      var noOfPlayersAfter = await driver
        .findElements(By.xpath("//*[@class='leagueTable']/tbody/tr"))
        .then(elements => {
          return elements.length;
        });
      expect(noOfPlayersAfter).to.equal(noOfPlayers - 1);
    });

    it("should be able to add a player to a season", async () => {
      await jest.setTimeout(30000);
      var noOfPlayers = await driver
        .findElements(By.xpath("//*[@class='leagueTable']/tbody/tr"))
        .then(elements => {
          return elements.length;
        });
      await driver.navigate().refresh();
      await driver.sleep(500);
      await driver.findElement(By.id("addPlayerBtn")).click();
      await driver.findElement(By.id("confirmBtn")).click();
      await driver.sleep(2000);
      var noOfPlayersAfter = await driver
        .findElements(By.xpath("//*[@class='leagueTable']/tbody/tr"))
        .then(elements => {
          return elements.length;
        });
      expect(noOfPlayersAfter).to.equal(noOfPlayers + 1);
    });
  });

  describe("Deleting a season", () => {
    /* affects database */
    it("should be able to delete a season", async () => {
      await jest.setTimeout(30000);
      await driver.get(homepage + "8-ball/seasons");
      await driver.sleep(1000);
      var noOfSeasons = await driver
        .findElements(By.className("season-list-item"))
        .then(elements => {
          return elements.length;
        });
      await driver.findElement(By.id("remove5000")).click();
      await driver
        .switchTo()
        .alert()
        .accept();
      await driver.sleep(2000);
      var noOfSeasonsAfter = await driver
        .findElements(By.className("season-list-item"))
        .then(elements => {
          return elements.length;
        });

      expect(noOfSeasonsAfter).to.equal(noOfSeasons - 1);
      await driver.quit();
    });
  });
});
