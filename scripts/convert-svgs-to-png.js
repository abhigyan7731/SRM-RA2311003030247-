const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function render(svgPath, outPath) {
  const svg = fs.readFileSync(svgPath, 'utf8');
  // attempt to get width/height from svg tag
  const whMatch = svg.match(/<svg[^>]*width=["']?(\d+)["']?[^>]*height=["']?(\d+)["']?[^>]*>/i);
  let width = 1200, height = 900;
  if (whMatch) {
    width = parseInt(whMatch[1], 10);
    height = parseInt(whMatch[2], 10);
  } else {
    const vb = svg.match(/viewBox=["']?([0-9 .]+)["']?/i);
    if (vb) {
      const parts = vb[1].trim().split(/\s+/);
      if (parts.length === 4) {
        width = parseInt(parts[2], 10) || width;
        height = parseInt(parts[3], 10) || height;
      }
    }
  }

  const html = `<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0;padding:0;background:#0f172a}</style></head><body>${svg}</body></html>`;

  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.setViewport({width, height, deviceScaleFactor:1});
  await page.setContent(html, {waitUntil: 'networkidle0'});
  // Wait a short moment for fonts/styles
  await page.waitForTimeout(250);
  await page.screenshot({path: outPath});
  await browser.close();
}

async function main(){
  const base = path.join(__dirname, '..', 'screenshots');
  const items = [
    {svg: path.join(base, 'top10-desktop.svg'), out: path.join(base, 'top10-desktop.png')},
    {svg: path.join(base, 'full-list-desktop.svg'), out: path.join(base, 'full-list-desktop.png')}
  ];

  for (const it of items) {
    if (!fs.existsSync(it.svg)) {
      console.error('Missing', it.svg);
      continue;
    }
    console.log('Rendering', it.svg, '->', it.out);
    await render(it.svg, it.out);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
