import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Dev default. To verify the deployed site, override at run time, e.g.:
    //   npx cypress run --config baseUrl=https://digitalhorizons.club
    baseUrl: 'http://localhost:5173',
  },
});
