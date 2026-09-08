// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [keystatic()],
  vite: {
    plugins: [tailwindcss()],
  },
});
