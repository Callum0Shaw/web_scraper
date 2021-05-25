import puppeteer from "puppeteer";

const getGps = () => {
  "gps";
};

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.ukclimbing.com/logbook/map/");

  // Enter in search form
  await page.type("#loc", "Glasgow");
  await page.keyboard.press("Tab");
  await page.keyboard.type("200");

  // Submit form
  await page.$eval("#searchform", (el) => el.submit());
  await page.waitForNavigation();

  let cragData = [];

  let ifNextPage = true;

  // Loop though all pages
  while (ifNextPage) {
    try {
      // Extract data
      let cragCards = await page.$$eval(".panel", (nodes) =>
        nodes.map((n) => {
          const gps = "gps"
          return {
            title: n.querySelector(".panel-heading").innerText,
            info: n.querySelector(".text-muted").innerText,
            gps,
          };
        })
      );
      cragData = cragData.concat(cragCards);

      // Check if last page
      ifNextPage = (await page.$("a[title='Next page']")) ? true : false;

      // Click to next page
      await (await page.$("a[title='Next page']")).click();
      await page.waitForNavigation();
    } catch (error) {
      console.log(error);
    }
  }
  const lastIndex = cragData.length - 1;
  console.log(cragData);
  // while (await this.page.$("a[title='Next page']")) {

  // }
})();
