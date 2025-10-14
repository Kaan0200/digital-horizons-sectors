import reactSupport from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        reactSupport({
            babel: {
                parserOpts: {
                    plugins: ['decorators-legacy', 'classProperties'],
                },
            },
        }),
        svgr({
            // svgr options: https://react-svgr.com/docs/options/
            svgrOptions: {
                exportType: 'default',
                ref: true,
                svgo: false,
                titleProp: true,
            },
            include: '**/*.svg',
        }),
    ],
    server: {
        host: '192.168.50.184', // effects dev only
    },
});
