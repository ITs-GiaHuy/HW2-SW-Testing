import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // HTML Reporter with StudentID metadata
  reporter: [
    ['html', {
      open: 'never',
      outputFolder: 'playwright-report',
      title: 'Run by: 23127378 - Nguyễn Gia Huy',
    }],
    ['list'],
    ['json', {
      outputFile: 'results.json',
    }],
  ],

  // Custom metadata — displayed in HTML report
  metadata: {
    'Run by': '23127378 - Nguyễn Gia Huy',
    'Project': 'EShop Web Automation Testing — HW04',
    'Timestamp': new Date().toISOString(),
    'Environment': process.env.CI ? 'CI' : 'Local',
  },

  use: {
    // Base URLs — no hardcoded URLs in tests
    baseURL: process.env.WEB_BASE_URL || 'http://localhost:5173',
    
    // Screenshot on failure for bug evidence
    screenshot: 'only-on-failure',
    
    // Trace on first retry for debugging
    trace: 'on-first-retry',
    
    // Video on failure for bug evidence
    video: 'on-first-retry',
    

  },

  // Multi-browser projects — 3 browsers × all features = ≥9 runs
  projects: [
    // ── Web Frontend (Customer) ──
    {
      name: 'web-chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.WEB_BASE_URL || 'http://localhost:5173',
      },
      testMatch: /tests\/(web)\/.*\.spec\.ts/,
    },
    {
      name: 'web-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: process.env.WEB_BASE_URL || 'http://localhost:5173',
      },
      testMatch: /tests\/(web)\/.*\.spec\.ts/,
    },
    {
      name: 'web-webkit',
      use: {
        ...devices['Desktop Safari'],
        baseURL: process.env.WEB_BASE_URL || 'http://localhost:5173',
      },
      testMatch: /tests\/(web)\/.*\.spec\.ts/,
    },

    // ── Admin Frontend ──
    {
      name: 'admin-chromium',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.ADMIN_BASE_URL || 'http://localhost:5174',
      },
      testMatch: /tests\/(admin)\/.*\.spec\.ts/,
    },
    {
      name: 'admin-firefox',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: process.env.ADMIN_BASE_URL || 'http://localhost:5174',
      },
      testMatch: /tests\/(admin)\/.*\.spec\.ts/,
    },
    {
      name: 'admin-webkit',
      use: {
        ...devices['Desktop Safari'],
        baseURL: process.env.ADMIN_BASE_URL || 'http://localhost:5174',
      },
      testMatch: /tests\/(admin)\/.*\.spec\.ts/,
    },
  ],
});
