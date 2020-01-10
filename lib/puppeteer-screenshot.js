const puppeteer = require('puppeteer');

const weatherUrl = 'https://www.bbc.com/weather/683506';
const yieldUrl = 'https://www.gurufocus.com/yield_curve.php';

const el = 'div[data-component-id="forecast"]';
const yieldEl = '#spread_chart_container';
const yieldPopupCloseBtn = '#cboxClose';

async function initBrowser () {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});

  return { browser, page };
}

async function takeScreenshot(browser, element, fileName) {
  console.log('Attempt to create screenshot for: ', fileName);
  await element.screenshot({
    path: fileName
  });
  console.log('Finished screenshot: ', fileName);
  await browser.close();
}

async function getWeatherScreenshot () {
  const { browser, page } = await initBrowser();

  console.log('Opening page: ', weatherUrl);
  await page.goto(weatherUrl, { waitUntil: 'networkidle0' });
  console.log('Navigated');
  await page.waitForSelector(el);
  const div = await page.$(el);

  await takeScreenshot(browser, div, 'weather.png');
}

async function getUSYieldCurveScreenshot () {
  const { browser, page } = await initBrowser();

  console.log('Opening page: ', yieldUrl);
  await page.goto(yieldUrl, { waitUntil: 'networkidle0' });
  await page.waitForSelector(yieldPopupCloseBtn);
  await page.click(yieldPopupCloseBtn);
  await page.waitForSelector(yieldPopupCloseBtn, { hidden: true });
  await page.waitForSelector(yieldEl);
  const div = await page.$(yieldEl);

  await takeScreenshot(browser, div, 'yield.png');
}

module.exports = {
  getWeatherScreenshot: getWeatherScreenshot,
  getUSYieldCurveScreenshot: getUSYieldCurveScreenshot,
};
