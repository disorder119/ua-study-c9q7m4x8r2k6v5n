import {defineConfig,devices} from '@playwright/test';

export default defineConfig({
  testDir:'./tests',
  testMatch:'browser-smoke.spec.mjs',
  timeout:90000,
  expect:{timeout:15000},
  fullyParallel:false,
  workers:1,
  retries:1,
  reporter:'line',
  use:{
    baseURL:'http://127.0.0.1:4173',
    locale:'de-DE',
    serviceWorkers:'allow',
    trace:'retain-on-failure'
  },
  projects:[
    {name:'chromium-desktop',use:{...devices['Desktop Chrome']}},
    {name:'webkit-iphone',use:{...devices['iPhone 13']}}
  ],
  webServer:{
    command:'python3 -m http.server 4173 --bind 127.0.0.1',
    url:'http://127.0.0.1:4173/ukrainischkurs-app.html',
    reuseExistingServer:true,
    timeout:30000
  }
});