const puppeteer = require('puppeteer');

const weatherUrl = 'https://www.bbc.com/weather/683506';
const yieldUrl = 'https://www.gurufocus.com/yield_curve.php';

const el = 'div[data-component-id="forecast"]';
const yieldEl = '#spread_chart_container';
const yieldPopupCloseBtn = '#cboxClose';

async function getWeatherScreenshot () {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});

  console.log('Opening page: ', weatherUrl);
  await page.goto('https://www.bbc.com/weather/683506', { waitUntil: 'networkidle0' });
  console.log('Navigated');
  await page.waitForSelector(el);
  const div = await page.$(el);

  console.log('Attempt to create screenshot for weather');

  await div.screenshot({
    path:`weather.png`
  });
  console.log('Finished');
  await browser.close();
}

async function getUSYieldCurveScreenshot () {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  console.log('Opening page: ', yieldUrl);
  await page.goto(yieldUrl, { waitUntil: 'networkidle0' });
  await page.waitForSelector(yieldPopupCloseBtn);
  await page.click(yieldPopupCloseBtn);
  await page.waitForSelector(yieldEl);
  const div = await page.$(yieldEl);

  console.log('Attempt to create screenshot for yield curve');

  await div.screenshot({
    path:`yield.png`
  });
  console.log('Finished');
  await browser.close();
}

module.exports = {
  getWeatherScreenshot: getWeatherScreenshot,
  getUSYieldCurveScreenshot: getUSYieldCurveScreenshot,
};
