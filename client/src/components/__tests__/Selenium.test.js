import chai, { expect } from "chai";
require("chromedriver");
const { Builder, By, Key, until } = require("selenium-webdriver");
var driver = new Builder().forBrowser("chrome").build();
chai.use(require("chai-as-promised"));
var homepage = "http://nldpoolleague.azurewebsites.net";
setTimeout(30000);

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
    var driver = new Builder().forBrowser("chrome").build();
    await driver.get(homepage);
    await driver
      .findElement(
        By.xpath("//*[@id='nineBallLink'][@class='landingPageLink']")
      )
      .click();
    var actual = await driver.getCurrentUrl();
    var expected = homepage + "/9-ball/";
    expect(actual).to.contain(expected);
    await driver.quit();
  });
});
