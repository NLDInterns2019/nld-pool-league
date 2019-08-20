import chai, { expect } from "chai";
require("chromedriver");
const { Builder, By, Key, until } = require("selenium-webdriver");

chai.use(require("chai-as-promised"));
var driver = new Builder().forBrowser("chrome").build();
var homepage = "http://nldpoolleague.azurewebsites.net";

describe("LandingPage", () => {
  it("should have expected title value", async () => {
    await driver.get(homepage);
    var actual = await driver.getTitle();
    var expected = "Pool Manager";
    expect(actual).to.equal(expected);
  });

  it("should navigate to the 8-ball overview page when 8-ball is clicked", async () => {
    await driver.get(homepage);
    await driver.findElement(By.id("eightBallLink")).click();
    await driver.wait(until.elementIsVisible);
    var actual = await driver.getCurrentUrl();
    var expected = homepage + "/8-ball/overview/";
    expect(actual).to.contain(expected);
  });

  it("should navigate to the 9-ball overview page when 9-ball is clicked", async () => {
    await driver.get(homepage);
    await driver.findElement(By.id("nineBallLink")).click();
    await driver.wait(until.elementIsVisible);
    var actual = await driver.getCurrentUrl();
    var expected = homepage + "/9-ball/overview/";
    expect(actual).to.contain(expected);
    await driver.quit();
  });
});
