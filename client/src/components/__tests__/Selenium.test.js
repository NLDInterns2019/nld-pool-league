import chai, { expect } from "chai";
require("chromedriver");
const { Builder, By, Key, until } = require("selenium-webdriver");
var driver = new Builder().forBrowser("chrome").build();
driver
  .manage()
  .window()
  .maximize();
chai.use(require("chai-as-promised"));
var homepage = "http://nldpoolleague.azurewebsites.net";

describe("App", () => {
  // uncomment to demonstrate
  //   afterEach(async () => {
  //     await driver.sleep(500);
  //   });

  describe("LandingPage", () => {
    it("should have expected title value", async () => {
      await setTimeout(10000);
      await driver.get(homepage);
      var actual = await driver.getTitle();
      var expected = "Pool Manager";
      expect(actual).to.equal(expected);
    });

    it("should navigate to the 8-ball section when 8-ball is clicked", async () => {
      await setTimeout(10000);
      await driver.get(homepage);
      await driver
        .findElement(
          By.xpath("//*[@id='eightBallLink'][@class='landingPageLink']")
        )
        .click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "/8-ball/";
      expect(actual).to.contain(expected);
    });

    it("should navigate to the 9-ball section when 9-ball is clicked", async () => {
      await setTimeout(10000);
      await driver.get(homepage);
      await driver
        .findElement(
          By.xpath("//*[@id='nineBallLink'][@class='landingPageLink']")
        )
        .click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "/9-ball/";
      expect(actual).to.contain(expected);
    });
  });

  describe("8-ball Seasons page navigation", () => {
    beforeEach(async () => {
      await driver.get(homepage + "/8-ball/seasons");
    });
    it('should navigate to the landing page when "POOL MANAGER" is clicked', async () => {
      await setTimeout(10000);
      await driver.findElement(By.xpath("//*[@class='headerLeft']/a")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "/";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 9-ball seasons page when "9-ball" is clicked', async () => {
      await setTimeout(10000);
      await driver.findElement(By.id("nineBallLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "/9-ball/seasons";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 8-ball kitty when "kitty" clicked', async () => {
      await setTimeout(10000);
      await driver.findElement(By.id("KittyLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "/8-ball/kitty";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the hall of fame when "Hall of Fame" clicked', async () => {
      await setTimeout(10000);
      await driver.findElement(By.id("HoFLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "/8-ball/hall_of_fame";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 8-ball overview when "current season" clicked', async () => {
      await setTimeout(10000);
      await driver.findElement(By.id("fixturesLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "/8-ball/overview/";
      expect(actual).to.contain(expected);
    });
  });

  describe("9-ball Seasons page navigation", () => {
    beforeEach(async () => {
      await driver.get(homepage + "/9-ball/seasons");
    });
    it('should navigate to the landing page when "POOL MANAGER" is clicked', async () => {
      await setTimeout(10000);
      await driver.findElement(By.xpath("//*[@class='headerLeft']/a")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "/";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 8-ball seasons page when "8-ball" is clicked', async () => {
      await setTimeout(10000);
      await driver.findElement(By.id("eightBallLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "/8-ball/seasons";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 9-ball kitty when "kitty" clicked', async () => {
      await setTimeout(10000);
      await driver.findElement(By.id("KittyLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "/9-ball/kitty";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the hall of fame when "Hall of Fame" clicked', async () => {
      await setTimeout(10000);
      await driver.findElement(By.id("HoFLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "/9-ball/hall_of_fame";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 9-ball overview when "current season" clicked', async () => {
      await setTimeout(10000);
      await driver.findElement(By.id("fixturesLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "/9-ball/overview/";
      expect(actual).to.contain(expected);
      await driver.quit();
    });
  });
});
