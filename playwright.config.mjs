import {defineConfig,devices} from '@playwright/test';

export default defineConfig({
  testDir:'./tests',
  testMatch:'alphabet-lab-v4-e2e.spec.mjs',
  timeout:30000,
  expect:{timeout:5000},
  fullyParallel:false,
  retries:0,
  reporter:'line',
  use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure'},
  webServer:{command:'python3 -m http.server 4173 --bind 127.0.0.1',port:4173,reuseExistingServer:!process.env.CI,timeout:15000},
  projects:[
    {name:'chromium-desktop',use:{...devices['Desktop Chrome']}},
    {name:'webkit-iphone',use:{...devices['iPhone 13']}}
  ]
});
