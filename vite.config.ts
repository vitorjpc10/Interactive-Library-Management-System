// vite.config.ts
//!REMOVE THIS FILE ONCE IN PRODUCTION


import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4200,
    allowedHosts: true, // This will allow all hosts
    strictPort: true,
    origin: 'https://maximum-marten-allegedly.ngrok-free.app', // test by removing this!
  },
});
