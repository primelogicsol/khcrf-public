const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://khcrf.org/about/memberships/join?returnTo=%2Fmaster-artisans%2Fissues%2Fwalnut-wood-khatamband-2026", { waitUntil: "networkidle2" });
  const text = await page.evaluate(() => document.body.innerText);
  console.log(text.includes("Something went wrong") ? "CRASHED ON SCREEN" : "RENDERED FINE");
  if (text.includes("Something went wrong")) {
      console.log("CRASHED!");
  } else {
      console.log("Success text:", text.substring(0, 200).replace(/\n/g, " "));
  }
  await browser.close();
})();
