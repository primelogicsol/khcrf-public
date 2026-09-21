const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://khcrf.org/login", { waitUntil: "networkidle2" });
  const text = await page.evaluate(() => document.body.innerText);
  console.log("Login text:", text.substring(0, 200).replace(/\n/g, " "));
  await browser.close();
})();
