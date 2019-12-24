const puppeteer = require('puppeteer');

const el = 'div[data-component-id="forecast"]';

async function getWeatherScreenshot () {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768});

  console.log('Opening page');
  await page.goto('https://www.bbc.com/weather/683506', { waitUntil: 'networkidle0' });
  await page.waitForSelector(el);
  const div = await page.$(el);

  console.log('Attempt to create screenshot');

  await div.screenshot({
    path:`weather.png`
  });
  console.log('Finished');
  await browser.close();
}

module.exports = {
  getWeatherScreenshot: getWeatherScreenshot
};
