// scripts/verify-pulse-ai.cjs
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.join(__dirname, '..', 'audit_results', 'pulse_ai_proofs');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function verifyPulseAi() {
  console.log('================================================================');
  console.log('STARTING PULSE AI POPUP WINDOW & FLOATING TRIGGER VERIFICATION');
  console.log('================================================================');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Connecting to:', BASE_URL);
  await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await delay(1500);

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      console.log(`  ✓ [PASS] ${message}`);
      passedTests++;
    } else {
      console.error(`  ✗ [FAIL] ${message}`);
    }
  }

  // 1. Verify Top Header Labeled 💬 Pulse AI Button
  console.log('\n--- Test Group 1: Top Header Labeled 💬 Pulse AI Button ---');
  const headerButton = await page.evaluate(() => {
    const headerBtns = Array.from(document.querySelectorAll('header button'));
    const pulseBtn = headerBtns.find(b => b.innerText.includes('Pulse AI') || (b.title && b.title.includes('Pulse AI')));
    if (!pulseBtn) return null;
    const rect = pulseBtn.getBoundingClientRect();
    return {
      text: pulseBtn.innerText.trim(),
      title: pulseBtn.title,
      rect: {
        top: rect.top,
        right: window.innerWidth - rect.right,
        width: rect.width,
        height: rect.height
      }
    };
  });

  assert(headerButton !== null, 'Top Header contains Pulse AI button');
  assert(headerButton && headerButton.text.includes('Pulse AI'), `Header button is labeled with "Pulse AI": "${headerButton?.text}"`);
  assert(headerButton && headerButton.rect.top < 60, `Header button positioned in top header: top=${headerButton?.rect.top}px`);

  // Check alert badge on Day 30 vs nominal day
  console.log('\n--- Test Group 2: Day 30 Alert Badge on Header Pulse AI Button ---');
  const initialBadge = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Pulse AI'));
    return btn ? btn.innerText.includes('1 Alert Explainable') : false;
  });
  console.log('Initial day badge present on header button:', initialBadge);

  // 3. Header button verification
  console.log('\n--- Test Group 3: Header Button State ---');
  assert(headerButton && headerButton.title.includes('Pulse AI'), 'Header button has descriptive Module G title');

  // 4. Click Header Button to Open Side Panel
  console.log('\n--- Test Group 4: Opening Side Panel via Header Pulse AI Button ---');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Pulse AI'));
    if (btn) btn.click();
  });
  await delay(600);

  const popupInfo = await page.evaluate(() => {
    const popup = document.querySelector('aside[aria-label="Pulse AI & Voice Companion"]');
    if (!popup) return null;
    const rect = popup.getBoundingClientRect();
    const style = window.getComputedStyle(popup);
    return {
      width: rect.width,
      height: rect.height,
      bottom: window.innerHeight - rect.bottom,
      right: window.innerWidth - rect.right,
      hasBackdropBlur: popup.className.includes('backdrop-blur'),
      hasSkyBorder: popup.className.includes('border-sky-400')
    };
  });

  assert(popupInfo !== null, 'PulseAiAssistant side panel opened');
  assert(popupInfo && Math.abs(popupInfo.width - 385) <= 10, `Panel width is ~385px: ${popupInfo?.width}px`);
  assert(popupInfo && popupInfo.right < 10, `Panel docked to right edge: right=${popupInfo?.right}px`);
  assert(popupInfo && popupInfo.bottom < 10, `Panel extends to bottom of viewport: bottom=${popupInfo?.bottom}px`);

  // 5. Verify Header of Popup Window
  console.log('\n--- Test Group 5: Popup Window Header ---');
  const popupHeader = await page.evaluate(() => {
    const popup = document.querySelector('aside[aria-label="Pulse AI & Voice Companion"]');
    if (!popup) return null;
    const titleEl = popup.querySelector('h2');
    const telemetryEl = popup.querySelector('div.text-sky-300');
    const voiceBtn = popup.querySelector('button[title*="Voice Readout"]');
    const closeBtn = popup.querySelector('button[title*="Close Pulse AI"]');
    return {
      title: titleEl ? titleEl.innerText : '',
      telemetry: telemetryEl ? telemetryEl.innerText : '',
      hasVoiceToggle: voiceBtn !== null,
      hasCloseBtn: closeBtn !== null
    };
  });

  assert(popupHeader && popupHeader.title.includes('Pulse AI & Voice Companion'), `Header title: "${popupHeader?.title}"`);
  assert(popupHeader && popupHeader.telemetry.includes('Live Telemetry'), `Header telemetry text: "${popupHeader?.telemetry}"`);
  assert(popupHeader && popupHeader.hasVoiceToggle, 'Voice Readout toggle button present');
  assert(popupHeader && popupHeader.hasCloseBtn, 'Close button present');

  // 6. Verify Quick Prompt Chips and ZERO Horizontal Overflow
  console.log('\n--- Test Group 6: Quick Prompt Chips & ZERO Horizontal Overflow ---');
  const promptChipsInfo = await page.evaluate(() => {
    const popup = document.querySelector('aside[aria-label="Pulse AI & Voice Companion"]');
    if (!popup) return null;
    const chipsContainer = popup.querySelector('.flex.flex-wrap');
    if (!chipsContainer) return null;
    const chipBtns = Array.from(chipsContainer.querySelectorAll('button'));
    const isOverflownHorizontally = chipsContainer.scrollWidth > chipsContainer.clientWidth;
    return {
      chips: chipBtns.map(b => b.innerText.trim()),
      scrollWidth: chipsContainer.scrollWidth,
      clientWidth: chipsContainer.clientWidth,
      isOverflownHorizontally
    };
  });

  assert(promptChipsInfo !== null, 'Quick prompt chips container found');
  assert(promptChipsInfo && promptChipsInfo.isOverflownHorizontally === false, `ZERO horizontal overflow: scrollWidth=${promptChipsInfo?.scrollWidth}px, clientWidth=${promptChipsInfo?.clientWidth}px`);
  assert(promptChipsInfo && promptChipsInfo.chips.length === 4, `4 quick prompt chips rendered (found ${promptChipsInfo?.chips.length})`);
  assert(promptChipsInfo && promptChipsInfo.chips.some(c => c.includes('Status')), `Chip 1: "${promptChipsInfo?.chips[0]}"`);
  assert(promptChipsInfo && promptChipsInfo.chips.some(c => c.includes('Day 19 Workout')), `Chip 2: "${promptChipsInfo?.chips[1]}"`);
  assert(promptChipsInfo && promptChipsInfo.chips.some(c => c.includes('Baseline Freeze at Day 26')), `Chip 3: "${promptChipsInfo?.chips[2]}"`);
  assert(promptChipsInfo && promptChipsInfo.chips.some(c => c.includes('BP Self-Exam')), `Chip 4: "${promptChipsInfo?.chips[3]}"`);

  // 7. Conversational Engine: Query "status"
  console.log('\n--- Test Group 7: Conversational Engine - "status" Greeting & 6 Vitals ---');
  await page.evaluate(() => {
    const input = document.querySelector('aside[aria-label="Pulse AI & Voice Companion"] input');
    const form = document.querySelector('aside[aria-label="Pulse AI & Voice Companion"] form');
    if (input && form) {
      // Set react input value
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(input, 'status');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  });
  await delay(600);

  const statusReply = await page.evaluate(() => {
    const msgs = Array.from(document.querySelectorAll('aside[aria-label="Pulse AI & Voice Companion"] .whitespace-pre-wrap'));
    const lastMsg = msgs[msgs.length - 1];
    return lastMsg ? lastMsg.innerText : '';
  });

  assert(statusReply.includes('Commander Vega'), 'Greeting mentions Commander Vega');
  assert(statusReply.includes('Resting Heart Rate') && statusReply.includes('Blood Pressure') && statusReply.includes('Capillary Glucose') && statusReply.includes('Core Temperature') && statusReply.includes('Sleep Duration') && statusReply.includes('Environmental Radiation'), 'Bulleted summary contains all 6 vitals');
  assert(statusReply.includes('Personal Band'), 'Comparison against personal operating bands present');

  // 8. Conversational Engine: Chip "Why Did Day 19 Workout Not Alert?"
  console.log('\n--- Test Group 8: Conversational Engine - Day 19 Workout Confounder ---');
  await page.evaluate(() => {
    const popup = document.querySelector('aside[aria-label="Pulse AI & Voice Companion"]');
    const chipBtns = Array.from(popup.querySelectorAll('.flex.flex-wrap button'));
    const day19Btn = chipBtns.find(b => b.innerText.includes('Day 19'));
    if (day19Btn) day19Btn.click();
  });
  await delay(600);

  const day19Reply = await page.evaluate(() => {
    const msgs = Array.from(document.querySelectorAll('aside[aria-label="Pulse AI & Voice Companion"] .whitespace-pre-wrap'));
    const lastMsg = msgs[msgs.length - 1];
    const deepLinks = Array.from(document.querySelectorAll('aside[aria-label="Pulse AI & Voice Companion"] button')).map(b => b.innerText.trim());
    return {
      text: lastMsg ? lastMsg.innerText : '',
      hasJumpDay19: deepLinks.some(l => l.includes('Jump to Day 19')),
      hasSelfExam: deepLinks.some(l => l.includes('Open Self-Exam'))
    };
  });

  assert(day19Reply.text.includes('142 bpm') && day19Reply.text.includes('EXCLUDED_POST_EXERCISE_CONFOUNDER'), 'Day 19 explains 142 bpm ARED workout & EXCLUDED_POST_EXERCISE_CONFOUNDER');
  assert(day19Reply.hasJumpDay19, 'Contains [ Jump to Day 19 ] deep-link button');

  // 9. Conversational Engine: Chip "Why Did Baseline Freeze at Day 26?"
  console.log('\n--- Test Group 9: Conversational Engine - Day 26 Baseline Freeze ---');
  await page.evaluate(() => {
    const popup = document.querySelector('aside[aria-label="Pulse AI & Voice Companion"]');
    const chipBtns = Array.from(popup.querySelectorAll('.flex.flex-wrap button'));
    const day26Btn = chipBtns.find(b => b.innerText.includes('Day 26'));
    if (day26Btn) day26Btn.click();
  });
  await delay(600);

  const day26Reply = await page.evaluate(() => {
    const msgs = Array.from(document.querySelectorAll('aside[aria-label="Pulse AI & Voice Companion"] .whitespace-pre-wrap'));
    const lastMsg = msgs[msgs.length - 1];
    const deepLinks = Array.from(document.querySelectorAll('aside[aria-label="Pulse AI & Voice Companion"] button')).map(b => b.innerText.trim());
    return {
      text: lastMsg ? lastMsg.innerText : '',
      hasJumpDay26: deepLinks.some(l => l.includes('Jump to Day 26'))
    };
  });

  assert(day26Reply.text.includes('BASELINE FROZEN @ DAY 26') || day26Reply.text.includes('frozen'), 'Day 26 explains baseline freeze to prevent contamination');
  assert(day26Reply.hasJumpDay26, 'Contains [ Jump to Day 26 ] deep link');

  // 10. Conversational Engine: Query "day 30"
  console.log('\n--- Test Group 10: Conversational Engine - Day 30 Persistent Drift ---');
  await page.evaluate(() => {
    const input = document.querySelector('aside[aria-label="Pulse AI & Voice Companion"] input');
    const form = document.querySelector('aside[aria-label="Pulse AI & Voice Companion"] form');
    if (input && form) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(input, 'explain day 30');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  });
  await delay(600);

  const day30Reply = await page.evaluate(() => {
    const msgs = Array.from(document.querySelectorAll('aside[aria-label="Pulse AI & Voice Companion"] .whitespace-pre-wrap'));
    const lastMsg = msgs[msgs.length - 1];
    const deepLinks = Array.from(document.querySelectorAll('aside[aria-label="Pulse AI & Voice Companion"] button')).map(b => b.innerText.trim());
    return {
      text: lastMsg ? lastMsg.innerText : '',
      hasJumpDay30: deepLinks.some(l => l.includes('Jump to Day 30')),
      hasSelfExam: deepLinks.some(l => l.includes('Open Self-Exam'))
    };
  });

  assert(day30Reply.text.includes('PERSISTENT_TREND_DETECTED') || day30Reply.text.includes('breach personal band') || day30Reply.text.includes('3-of-4'), 'Day 30 explains 3-of-4 persistence breach');
  assert(day30Reply.hasJumpDay30, 'Contains [ Jump to Day 30 ] deep-link button');
  assert(day30Reply.hasSelfExam, 'Contains [ Open Self-Exam ] deep-link button');

  // Test Clicking [ Jump to Day 30 ]
  console.log('\n--- Test Group 11: Deep-Link Interaction: [ Jump to Day 30 ] ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside[aria-label="Pulse AI & Voice Companion"] button'));
    const jumpBtn = buttons.reverse().find(b => b.innerText.includes('Jump to Day 30'));
    if (jumpBtn) jumpBtn.click();
  });
  await delay(600);

  // Check if Day 30 alert badge is now visible on the header Pulse AI button!
  const day30Badge = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Pulse AI'));
    return btn ? { text: btn.innerText.trim(), hasBadge: btn.innerText.includes('1 Alert Explainable') } : null;
  });
  assert(day30Badge && day30Badge.hasBadge, `On Day 30, header button has '1 Alert Explainable' badge: "${day30Badge?.text}"`);

  // 12. Conversational Engine: Query Vitals ("bp", "glucose", "sans", "radiation")
  console.log('\n--- Test Group 12: Conversational Engine - Vitals Queries ---');
  // Query "bp"
  await page.evaluate(() => {
    const input = document.querySelector('aside[aria-label="Pulse AI & Voice Companion"] input');
    const form = document.querySelector('aside[aria-label="Pulse AI & Voice Companion"] form');
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(input, 'tell me about my bp');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  await delay(600);

  const bpReply = await page.evaluate(() => {
    const msgs = Array.from(document.querySelectorAll('aside[aria-label="Pulse AI & Voice Companion"] .whitespace-pre-wrap'));
    const lastMsg = msgs[msgs.length - 1];
    return lastMsg ? lastMsg.innerText : '';
  });
  assert(bpReply.includes('Blood Pressure') && bpReply.includes('mmHg'), 'BP query returns arterial blood pressure telemetry');

  // Query "sans"
  await page.evaluate(() => {
    const input = document.querySelector('aside[aria-label="Pulse AI & Voice Companion"] input');
    const form = document.querySelector('aside[aria-label="Pulse AI & Voice Companion"] form');
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(input, 'explain sans risk');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  await delay(600);

  const sansReply = await page.evaluate(() => {
    const msgs = Array.from(document.querySelectorAll('aside[aria-label="Pulse AI & Voice Companion"] .whitespace-pre-wrap'));
    const lastMsg = msgs[msgs.length - 1];
    return lastMsg ? lastMsg.innerText : '';
  });
  assert(sansReply.includes('Neuro-ocular') && sansReply.includes('Amsler Grid'), 'SANS query returns neuro-ocular syndrome and Amsler grid details');

  // Query "radiation"
  await page.evaluate(() => {
    const input = document.querySelector('aside[aria-label="Pulse AI & Voice Companion"] input');
    const form = document.querySelector('aside[aria-label="Pulse AI & Voice Companion"] form');
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    nativeInputValueSetter.call(input, 'how is radiation?');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  await delay(600);

  const radReply = await page.evaluate(() => {
    const msgs = Array.from(document.querySelectorAll('aside[aria-label="Pulse AI & Voice Companion"] .whitespace-pre-wrap'));
    const lastMsg = msgs[msgs.length - 1];
    return lastMsg ? lastMsg.innerText : '';
  });
  assert(radReply.includes('Radiation') && radReply.includes('CANS'), 'Radiation query returns radiation telemetry and CANS sensor information');

  // 13. Test [ Open Self-Exam ] Deep Link
  console.log('\n--- Test Group 13: Deep-Link Interaction: [ Open Self-Exam ] ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('aside[aria-label="Pulse AI & Voice Companion"] button'));
    const examBtn = buttons.reverse().find(b => b.innerText.includes('Open Self-Exam'));
    if (examBtn) examBtn.click();
  });
  await delay(600);

  const selfExamModalOpen = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"]') || document.querySelector('div.fixed.inset-0');
    return modal !== null && modal.innerText.includes('Self-Assessment');
  });
  assert(selfExamModalOpen, 'Clicking [ Open Self-Exam ] opens the guided self-assessment modal');

  // Close Self-Exam Modal to return to console
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[title*="Close"]');
    if (closeBtn) closeBtn.click();
  });
  await delay(400);

  // Take full screenshot proof of Day 30 with popup window open
  const screenshotPath = path.join(OUTPUT_DIR, 'pulse_ai_day30_popup_verified.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`\nScreenshot saved: ${screenshotPath}`);

  // 14. Test Popup Close Button
  console.log('\n--- Test Group 14: Popup Close Button ---');
  await page.evaluate(() => {
    const closeBtn = document.querySelector('aside[aria-label="Pulse AI & Voice Companion"] button[title*="Close Pulse AI"]');
    if (closeBtn) closeBtn.click();
  });
  await delay(400);

  const isPopupClosed = await page.evaluate(() => {
    return document.querySelector('aside[aria-label="Pulse AI & Voice Companion"]') === null;
  });
  assert(isPopupClosed, 'Popup window closes successfully via × button');

  // Verify Header Button is still present when panel is closed
  const headerBtnStillPresent = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Pulse AI'));
    return btn !== null;
  });
  assert(headerBtnStillPresent, 'Header button remains visible when panel is closed');

  console.log('================================================================');
  console.log(`RESULTS: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)`);
  console.log('================================================================');

  await browser.close();
  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

verifyPulseAi().catch(err => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
