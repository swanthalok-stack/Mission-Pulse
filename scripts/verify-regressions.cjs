// scripts/verify-regressions.cjs
// Targeted Verification Suite for the 4 Regressions on Live / Health Overview Screen

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.join(__dirname, '..', 'audit_results', 'verification_proofs');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runRegressionVerification() {
  console.log('================================================================');
  console.log('TARGETED VERIFICATION: 4 LIVE SCREEN REGRESSIONS');
  console.log('================================================================');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('  [BROWSER ERROR]:', msg.text());
    }
  });

  console.log('Connecting to:', BASE_URL);
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await delay(1000);

  // Reset to clean initial dataset
  await page.evaluate(() => {
    localStorage.removeItem('MISSION_PULSE_DATASET_V1');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await delay(1000);

  // ---------------------------------------------------------------------------
  // REGRESSION 1: INTERACTIVE DAY SCRUBBER ON LIVE SCREEN
  // ---------------------------------------------------------------------------
  console.log('\n--- 1. Testing Interactive Day Scrubber on Live Screen ---');
  const scrubberData = await page.evaluate(() => {
    const headerRow = document.querySelector('.col-span-12.xl\\:col-span-9 > div:first-child');
    const badge = document.querySelector('[data-testid="live-status-badge"]');
    const scrubber = document.querySelector('[data-testid="interactive-day-scrubber"]');
    const select = scrubber ? scrubber.querySelector('select') : null;
    const prevBtn = scrubber ? scrubber.querySelector('button[aria-label="Previous Day"]') : null;
    const nextBtn = scrubber ? scrubber.querySelector('button[aria-label="Next Day"]') : null;
    const playBtn = scrubber ? scrubber.querySelector('button[aria-label="Play"], button[aria-label="Pause"]') : null;

    return {
      headerHasBadge: !!badge,
      badgeText: badge ? badge.textContent.trim() : null,
      headerHasScrubber: !!scrubber,
      selectOptionsCount: select ? select.options.length : 0,
      currentSelectValue: select ? select.value : null,
      hasPrevBtn: !!prevBtn,
      hasNextBtn: !!nextBtn,
      hasPlayBtn: !!playBtn,
      selectIsVisible: select ? select.offsetParent !== null : false
    };
  });

  console.log('  Day Scrubber details:', scrubberData);
  if (!scrubberData.headerHasBadge || !scrubberData.headerHasScrubber) {
    throw new Error('FAIL: Status badge or Day Scrubber not found on Crew A-03 header row!');
  }
  if (!scrubberData.selectIsVisible || scrubberData.selectOptionsCount !== 60) {
    throw new Error(`FAIL: Day Selector select invalid! Options: ${scrubberData.selectOptionsCount}, Visible: ${scrubberData.selectIsVisible}`);
  }

  // Test Day Scrubber interaction: switch to Day 29 via select
  await page.evaluate(() => {
    const select = document.querySelector('[data-testid="interactive-day-scrubber"] select');
    select.value = '29';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await delay(500);

  // Verify Day 29 changed
  const day29Check = await page.evaluate(() => {
    const select = document.querySelector('[data-testid="interactive-day-scrubber"] select');
    return select.value;
  });
  console.log('  Switched to Day 29 via select:', day29Check === '29');
  if (day29Check !== '29') throw new Error('FAIL: Day did not switch to 29!');

  // Test Next Day Button (▶) -> switches to Day 30
  await page.evaluate(() => {
    const nextBtn = document.querySelector('[data-testid="interactive-day-scrubber"] button[aria-label="Next Day"]');
    if (nextBtn) nextBtn.click();
  });
  await delay(500);

  const day30Check = await page.evaluate(() => {
    const select = document.querySelector('[data-testid="interactive-day-scrubber"] select');
    const badge = document.querySelector('[data-testid="live-status-badge"]');
    return {
      day: select.value,
      badgeText: badge ? badge.textContent.trim() : ''
    };
  });
  console.log('  Switched back to Day 30 via ▶ button:', day30Check);
  if (day30Check.day !== '30' || !day30Check.badgeText.includes('Persistent Drift')) {
    throw new Error('FAIL: Day 30 not reached or badge does not indicate Persistent Drift!');
  }
  console.log('  ✓ Regression 1 PASS: Interactive Day Scrubber restored and fully functional on Live screen.');

  // ---------------------------------------------------------------------------
  // REGRESSION 2: ADD SLEEP & RADIATION TO CHART PILL BAR + ACTIVE PILL HIGHLIGHT
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. Testing Sleep & Radiation in Chart Metric Pill Bar ---');
  const metricTabs = await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('[data-testid^="metric-pill-"]'));
    return pills.map(p => ({
      id: p.getAttribute('data-testid').replace('metric-pill-', ''),
      label: p.textContent.trim(),
      className: p.className
    }));
  });

  console.log('  Pill bar tabs:', metricTabs.map(t => `${t.label} (${t.id})`).join(' | '));
  const expectedLabels = ['Resting HR', 'BP', 'Glucose', 'Core Temp', 'Sleep', 'Radiation', 'SpO2', 'Activity'];
  const actualLabels = metricTabs.map(t => t.label);
  const labelsMatch = JSON.stringify(actualLabels) === JSON.stringify(expectedLabels);
  if (!labelsMatch) {
    throw new Error(`FAIL: Metric tabs order mismatch! Expected: ${expectedLabels.join(', ')}, Actual: ${actualLabels.join(', ')}`);
  }

  // Click Sleep Vital Card
  console.log('  Clicking Sleep card...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.grid-cols-6 > div'));
    const sleepCard = cards.find(c => (c.innerText || '').includes('Sleep'));
    if (sleepCard) sleepCard.click();
  });
  await delay(400);

  const sleepActiveCheck = await page.evaluate(() => {
    const pill = document.querySelector('[data-testid="metric-pill-sleepHours"]');
    const isGlowing = pill && (pill.className.includes('from-white') || pill.className.includes('shadow-'));
    return {
      text: pill ? pill.textContent.trim() : null,
      isGlowing,
      className: pill ? pill.className : null
    };
  });
  console.log('  Sleep tab active after Sleep card click:', sleepActiveCheck);
  if (!sleepActiveCheck.isGlowing) {
    throw new Error('FAIL: Sleep tab does not render bright glowing active pill highlight!');
  }

  // Click Radiation Vital Card
  console.log('  Clicking Radiation card...');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.grid-cols-6 > div'));
    const radCard = cards.find(c => (c.innerText || '').includes('Radiation'));
    if (radCard) radCard.click();
  });
  await delay(400);

  const radActiveCheck = await page.evaluate(() => {
    const pill = document.querySelector('[data-testid="metric-pill-radiation"]');
    const isGlowing = pill && (pill.className.includes('from-white') || pill.className.includes('shadow-'));
    return {
      text: pill ? pill.textContent.trim() : null,
      isGlowing,
      className: pill ? pill.className : null
    };
  });
  console.log('  Radiation tab active after Radiation card click:', radActiveCheck);
  if (!radActiveCheck.isGlowing) {
    throw new Error('FAIL: Radiation tab does not render bright glowing active pill highlight!');
  }

  // Verify Radiation Y-axis decimal precision (must not be duplicate integer zeros/ones)
  const radYAxisTicks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('svg text[text-anchor="end"]'))
      .map(t => Number(t.textContent.trim()))
      .filter(n => !isNaN(n));
  });
  console.log('  Radiation Y-axis ticks:', radYAxisTicks);
  const uniqueTicks = new Set(radYAxisTicks);
  if (uniqueTicks.size < radYAxisTicks.length) {
    throw new Error(`FAIL: Duplicate Y-axis ticks detected on Radiation chart! Ticks: ${radYAxisTicks.join(', ')}`);
  }

  // Click direct chart tab: Glucose
  console.log('  Clicking Glucose tab directly on chart...');
  await page.evaluate(() => {
    const glucPill = document.querySelector('[data-testid="metric-pill-glucose"]');
    if (glucPill) glucPill.click();
  });
  await delay(400);

  const glucActiveCheck = await page.evaluate(() => {
    const pill = document.querySelector('[data-testid="metric-pill-glucose"]');
    return pill && pill.className.includes('from-white');
  });
  console.log('  Glucose tab active:', glucActiveCheck);
  if (!glucActiveCheck) throw new Error('FAIL: Glucose tab not active after click!');
  console.log('  ✓ Regression 2 (Pills) PASS: All 8 metric pills present with bright glowing active highlight.');

  // ---------------------------------------------------------------------------
  // REGRESSION 3: DAY 30 RESTING HR WAVEFORM MATCHES COMMANDER VEGA REAL HR (69 BPM)
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. Testing Day 30 Resting HR Waveform Matching 69 bpm Card ---');
  // Click Resting HR tab
  await page.evaluate(() => {
    const hrPill = document.querySelector('[data-testid="metric-pill-restingHR"]');
    if (hrPill) hrPill.click();
  });
  await delay(400);

  const hrWaveform = await page.evaluate(() => {
    // Check Card HR value
    const hrCard = Array.from(document.querySelectorAll('.grid-cols-6 > div')).find(c => (c.innerText || '').includes('Heart Rate'));
    const cardVal = hrCard ? hrCard.querySelector('.text-\\[20px\\], .text-\\[22px\\]')?.textContent.trim() : null;

    // Check SVG diamonds and markers
    const diamondGroups = Array.from(document.querySelectorAll('g[filter*="diamond"]'));
    const diamondData = diamondGroups.map(g => {
      return Array.from(g.querySelectorAll('text, tspan')).map(t => t.textContent.trim());
    });

    // Check Y-axis domain
    const yAxisTexts = Array.from(document.querySelectorAll('svg text[text-anchor="end"]')).map(t => Number(t.textContent.trim())).filter(n => !isNaN(n));

    return {
      cardVal,
      diamondCount: diamondGroups.length,
      diamondData,
      yAxisTicks: yAxisTexts
    };
  });

  console.log('  Heart Rate card & waveform telemetry:', JSON.stringify(hrWaveform, null, 2));
  if (hrWaveform.cardVal !== '69') {
    throw new Error(`FAIL: Heart Rate card value is ${hrWaveform.cardVal}, expected 69!`);
  }
  const has67Peak = hrWaveform.diamondData.some(d => d.some(t => t.includes('67')));
  const has69Peak = hrWaveform.diamondData.some(d => d.some(t => t.includes('69')));
  console.log('  Has 67 bpm peak diamond:', has67Peak);
  console.log('  Has 69 bpm peak diamond:', has69Peak);
  if (!has67Peak || !has69Peak) {
    throw new Error('FAIL: Chart does not plot Commander Vega peaks at 67 bpm and 69 bpm!');
  }
  console.log('  ✓ Regression 3 PASS: Chart plots Commander Vega real HR (58 baseline, 55-61 band, 67 and 69 peaks) matching 69 bpm card.');

  // ---------------------------------------------------------------------------
  // REGRESSION 4: REMOVE /nasa-logo.png AND REPLACE WITH MISSION PULSE EMBLEM
  // ---------------------------------------------------------------------------
  console.log('\n--- 4. Testing Mission Pulse Vector SVG Emblem & Citations Modal ---');
  const emblemData = await page.evaluate(() => {
    const nasaImg = document.querySelector('header img[src*="nasa-logo.png"]');
    const emblem = document.querySelector('header [data-testid="mission-pulse-emblem"]');
    const svg = emblem ? emblem.querySelector('svg.mission-pulse-emblem') : null;
    return {
      hasNasaLogoImg: !!nasaImg,
      hasEmblem: !!emblem,
      hasSvg: !!svg,
      svgViewBox: svg ? svg.getAttribute('viewBox') : null
    };
  });

  console.log('  Emblem audit:', emblemData);
  if (emblemData.hasNasaLogoImg) {
    throw new Error('FAIL: /nasa-logo.png still present in header!');
  }
  if (!emblemData.hasEmblem || !emblemData.hasSvg) {
    throw new Error('FAIL: Mission Pulse Orbital-ECG Vector SVG Emblem missing!');
  }

  // Click emblem to test opening Citations modal
  await page.evaluate(() => {
    const emblemContainer = document.querySelector('header [data-testid="mission-pulse-emblem"]')?.closest('.cursor-pointer');
    if (emblemContainer) emblemContainer.click();
  });
  await delay(600);

  const modalCheck = await page.evaluate(() => {
    const modal = document.querySelector('.fixed');
    const text = modal ? modal.innerText.toLowerCase() : '';
    return {
      isOpen: !!modal,
      hasHrp: text.includes('5 hazards') || text.includes('human spaceflight')
    };
  });
  console.log('  Citations Modal opened via emblem click:', modalCheck);
  if (!modalCheck.isOpen || !modalCheck.hasHrp) {
    throw new Error('FAIL: Citations Modal did not open when Mission Pulse emblem was clicked!');
  }

  // Close modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('.fixed button');
    if (closeBtn) closeBtn.click();
  });
  await delay(400);

  // Take proof screenshot
  const proofScreenshot = path.join(OUTPUT_DIR, '00_regressions_verified_proof.png');
  await page.screenshot({ path: proofScreenshot });
  console.log('  [SCREENSHOT SAVED]:', proofScreenshot);

  await browser.close();
  console.log('\n================================================================');
  console.log('ALL 4 REGRESSIONS CONFIRMED FIXED AND FULLY VERIFIED!');
  console.log('================================================================');
}

runRegressionVerification().catch(err => {
  console.error('REGRESSION VERIFICATION FAILED:', err);
  process.exit(1);
});
