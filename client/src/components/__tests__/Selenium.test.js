import chai, { expect } from "chai";
require("chromedriver");
const { Builder, By, Key, until } = require("selenium-webdriver");
var driver = new Builder().forBrowser("chrome").build();
chai.use(require("chai-as-promised"));
var homepage = "http://nldpoolleague.azurewebsites.net";
setTimeout(100000);

describe("App", () => {
  // uncomment to demonstrate
  //   afterEach(async () => {
  //     await driver.sleep(500);
  //   });

  describe("LandingPage", () => {
    it("should have expected title value", async () => {
      await driver.get(homepage);
      var actual = await driver.getTitle();
      var expected = "Pool Manager";
      expect(actual).to.equal(expected);
    });

    it("should navigate to the 8-ball section when 8-ball is clicked", async () => {
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
    it('should navigate to the landing page when "POOL MANAGER" is clicked', async () => {
      await driver.get(homepage + "/8-ball/seasons");
      await driver.findElement(By.xpath("//*[@class='headerLeft']/a")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "/";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 9-ball seasons page when "9-ball" is clicked', async () => {
      await driver.get(homepage + "/8-ball/seasons");
      await driver.findElement(By.id("nineBallLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "/9-ball/seasons";
      expect(actual).to.equal(expected);
    });
  });

  describe("9-ball Seasons page navigation", () => {
    it('should navigate to the landing page when "POOL MANAGER" is clicked', async () => {
      await driver.get(homepage + "/9-ball/seasons");
      await driver.findElement(By.xpath("//*[@class='headerLeft']/a")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "/";
      expect(actual).to.equal(expected);
    });

    it('should navigate to the 8-ball seasons page when "8-ball" is clicked', async () => {
      await driver.get(homepage + "/9-ball/seasons");
      await driver.findElement(By.id("eightBallLink")).click();
      var actual = await driver.getCurrentUrl();
      var expected = homepage + "/8-ball/seasons";
      expect(actual).to.equal(expected);
      await driver.quit();
    });
  });
});
