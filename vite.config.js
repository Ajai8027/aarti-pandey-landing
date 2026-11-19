import { defineConfig } from 'vite';

// Relative asset paths keep the built site portable when dist/index.html is
// opened from a nested folder by a plain static server such as VS Code Live Preview.
export default defineConfig({
  base: './',
});
