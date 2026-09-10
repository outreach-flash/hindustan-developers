// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: vercel(),
  integrations: [keystatic()],
  vite: {
    plugins: [tailwindcss()],
  },
});
