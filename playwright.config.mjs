import {defineConfig,devices} from '@playwright/test';

export default defineConfig({
  testDir:'./tests',
  testMatch:['alphabet-lab-v6-1-e2e.spec.mjs','alphabet-lab-v6-1-media.spec.mjs','alphabet-lab-v6-1-offline.spec.mjs'],
  timeout:30000,
  expect:{timeout:5000},
  fullyParallel:false,
  retries:0,
  reporter:'line',
  use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure'},
  webServer:{command:'python3 -m http.server 4173 --bind 127.0.0.1',port:4173,reuseExistingServer:!process.env.CI,timeout:15000},
  projects:[
    {name:'chromium-desktop-1280',use:{...devices['Desktop Chrome'],viewport:{width:1280,height:800}}},
    {name:'webkit-mobile-375',use:{...devices['iPhone 13'],viewport:{width:375,height:812}}}
  ]
});
