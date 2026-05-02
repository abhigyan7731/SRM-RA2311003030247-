const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

function readEnvToken() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return null;
  const content = fs.readFileSync(envPath, 'utf8');
  const m = content.match(/VITE_EVAL_TOKEN=(.+)/);
  return m ? m[1].trim() : null;
}

async function capture() {
  const token = readEnvToken();
  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();

  if (token) {
    await page.evaluateOnNewDocument((t) => {
      try { localStorage.setItem('evaluationAuthToken', t); } catch(e){}
    }, token);
  }

  const baseUrl = 'http://localhost:5175/';
  await page.goto(baseUrl, {waitUntil: 'networkidle2', timeout: 60000});
  // wait for notifications section
  try { await page.waitForSelector('#notifications', {timeout: 10000}); } catch(e){}
  const outDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, {recursive:true});
  const topPath = path.join(outDir, 'interactive-top10.png');
  await page.screenshot({path: topPath, fullPage: true});

  // click show full list
  const clicked = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => /Show full list|Hide full list/i.test(b.textContent));
    if (btn) { btn.click(); return true; }
    return false;
  });
  if (clicked) {
    try { await page.waitForSelector('#full-notifications', {timeout: 10000}); } catch(e){}
    const fullPath = path.join(outDir, 'interactive-full-list.png');
    await page.screenshot({path: fullPath, fullPage: true});
  }

  await browser.close();
  console.log('Captured screenshots to', outDir);
}

capture().catch(err=>{ console.error(err); process.exit(1); });
