import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs/promises';
import {
  MOCK_PRIMARY,
  MOCK_SECONDARY,
  MOCK_PRIMARY_2,
  MOCK_SECONDARY_2,
} from './fixtures/mock-archetypes';
import { getSectionsForTier } from './fixtures/mock-report';

const OUTPUT_BASE = path.join(
  process.env.HOME || '/Users/raullee',
  'Desktop/TEST-OUTPUTS/archetype',
);

const PDF_OPTIONS = {
  format: 'A4' as const,
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  preferCSSPageSize: true,
};

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function captureScreenshots(
  page: import('@playwright/test').Page,
  dir: string,
  baseName: string,
) {
  // Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(dir, `${baseName}-desktop.png`),
    fullPage: true,
  });

  // Mobile
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(dir, `${baseName}-mobile.png`),
    fullPage: true,
  });

  // Reset
  await page.setViewportSize({ width: 1440, height: 900 });
}

// ─── FREE TIER ─────────────────────────────────────────────

test.describe('Free Tier Output', () => {
  test.setTimeout(180000);

  test('capture free tier results with reveal', async ({ page }) => {
    const dir = path.join(OUTPUT_BASE, 'free-tier');
    await ensureDir(dir);

    await page.goto('http://localhost:3000/');
    await page.waitForLoadState('networkidle');

    // Navigate to quiz
    const quizLink = page.getByRole('link', { name: /take the quiz|start|begin/i });
    if (await quizLink.isVisible()) {
      await quizLink.click();
    } else {
      await page.goto('http://localhost:3000/test');
    }
    await page.waitForLoadState('networkidle');

    // Answer 8 questions — pick first visible answer option for each
    for (let i = 0; i < 8; i++) {
      await page.waitForTimeout(500);
      // Click an answer card/button
      const answerCards = page.locator(
        '[data-answer], button[class*="card"], button[class*="answer"], .answer-option, button',
      ).filter({ hasNotText: /back|previous|next|skip/i });

      const count = await answerCards.count();
      if (count > 0) {
        // Pick different answers for variety
        const idx = i % Math.min(count, 4);
        await answerCards.nth(idx).click();
      }
    }

    // Wait for analyzing animation + reveal
    await page.waitForTimeout(5000);

    // Capture the reveal moment
    await page.screenshot({
      path: path.join(dir, 'reveal-moment.png'),
      fullPage: false, // viewport only for the reveal
    });

    // Wait for full results to load
    await page.waitForTimeout(3000);

    // Full page captures
    await captureScreenshots(page, dir, 'results-page');
    await page.pdf({ ...PDF_OPTIONS, path: path.join(dir, 'results-page.pdf') });

    console.log('✓ Free tier outputs saved to', dir);
  });
});

// ─── PAID TIERS via report-render route ────────────────────

const TIER_CONFIGS = [
  {
    tier: 'basic' as const,
    dirName: 'basic-tier',
    primary: MOCK_PRIMARY,
    secondary: MOCK_SECONDARY,
  },
  {
    tier: 'full' as const,
    dirName: 'full-tier',
    primary: MOCK_PRIMARY,
    secondary: MOCK_SECONDARY,
  },
  {
    tier: 'couples' as const,
    dirName: 'couples-tier',
    primary: MOCK_PRIMARY,
    secondary: MOCK_SECONDARY,
    primary2: MOCK_PRIMARY_2,
    secondary2: MOCK_SECONDARY_2,
  },
];

for (const config of TIER_CONFIGS) {
  test.describe(
    `${config.tier.charAt(0).toUpperCase() + config.tier.slice(1)} Tier Output`,
    () => {
      test.setTimeout(120000);

      test(`capture ${config.tier} tier report`, async ({ page }) => {
        const dir = path.join(OUTPUT_BASE, config.dirName);
        await ensureDir(dir);

        const sections = getSectionsForTier(config.tier);
        const reportData = {
          sections,
          metadata: {
            generatedAt: new Date().toISOString(),
            wordCount: sections.reduce(
              (sum, s) => sum + s.content.split(/\s+/).length,
              0,
            ),
          },
        };

        // Encode report data as base64 for URL
        const dataParam = Buffer.from(JSON.stringify(reportData)).toString(
          'base64url',
        );

        // Build URL with searchParams
        const url = new URL('http://localhost:3000/report-render');
        url.searchParams.set('primary', config.primary);
        url.searchParams.set('secondary', config.secondary);
        url.searchParams.set('tier', config.tier);
        url.searchParams.set('data', dataParam);
        if (config.primary2) {
          url.searchParams.set('primary2', config.primary2);
        }
        if (config.secondary2) {
          url.searchParams.set('secondary2', config.secondary2);
        }

        await page.goto(url.toString());
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Capture screenshots
        await captureScreenshots(page, dir, 'report');

        // Capture PDF
        await page.pdf({ ...PDF_OPTIONS, path: path.join(dir, 'report.pdf') });

        console.log(`✓ ${config.tier} tier outputs saved to`, dir);
      });
    },
  );
}
