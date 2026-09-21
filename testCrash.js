const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on("pageerror", err => console.log("PAGE ERROR:", err.message));
  page.on("console", msg => {
    if (msg.type() === "error") console.log("CONSOLE ERROR:", msg.text());
  });
  await page.goto("https://khcrf.org/about/memberships/join", { waitUntil: "networkidle2" });
  await browser.close();
})();
