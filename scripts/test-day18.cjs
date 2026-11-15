const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173');
  await page.evaluate(() => {
    localStorage.removeItem('MISSION_PULSE_DATASET_V1');
  });
  await page.reload();
  await new Promise(r => setTimeout(r, 1000));
  
  // Set day 30 first
  await page.evaluate(() => {
    const sel = document.querySelector('select');
    sel.value = '30';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 800));

  // Set day 18
  await page.evaluate(() => {
    const sel = document.querySelector('select');
    sel.value = '18';
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await new Promise(r => setTimeout(r, 800));

  const pings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.animate-ping')).map(el => {
      let curr = el;
      let path = [];
      while (curr && curr !== document.body) {
        path.unshift(curr.tagName + (curr.className ? '.' + curr.className.split(' ').join('.') : ''));
        curr = curr.parentElement;
      }
      return {
        html: el.outerHTML,
        path: path.join(' > ')
      };
    });
  });

  console.log('Day 18 pings:', JSON.stringify(pings, null, 2));
  await browser.close();
})();
