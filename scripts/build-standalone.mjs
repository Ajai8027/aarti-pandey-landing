/**
 * Produces standalone/index.html: one self-contained file with the bundled
 * CSS, JavaScript and artwork inlined, so it can be opened directly from
 * File Explorer without a dev server or network connection.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const outputDir = join(root, 'standalone');

// Always inline the newest production build.
execFileSync(process.execPath, [join(root, 'node_modules', 'vite', 'bin', 'vite.js'), 'build'], {
  cwd: root,
  stdio: 'inherit',
});

let html = readFileSync(join(dist, 'index.html'), 'utf8');

/** Replace every relative artwork URL with an embedded data URI. */
function inlineArtwork(source) {
  const assets = readdirSync(join(dist, 'assets')).filter((file) => /\.(svg|png)$/i.test(file));

  return assets.reduce((text, file) => {
    const mime = file.toLowerCase().endsWith('.svg') ? 'image/svg+xml' : 'image/png';
    const dataUri = `data:${mime};base64,${readFileSync(join(dist, 'assets', file)).toString('base64')}`;
    return text.replaceAll(`./assets/${file}`, dataUri).replaceAll(`/assets/${file}`, dataUri);
  }, source);
}

const scriptTag = html.match(/<script[^>]+src="([^"]+\.js)"[^>]*><\/script>/);
const styleTag = html.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/);
const iconTag = html.match(/<link[^>]+rel="icon"[^>]*>/);

if (!scriptTag || !styleTag || !iconTag) {
  throw new Error('Could not find the built script, stylesheet or favicon in dist/index.html.');
}

const script = inlineArtwork(readFileSync(join(dist, scriptTag[1]), 'utf8')).replaceAll('</script', '<\\/script');
const styles = inlineArtwork(readFileSync(join(dist, styleTag[1]), 'utf8'));
const favicon = `data:image/svg+xml;base64,${readFileSync(join(dist, 'favicon.svg')).toString('base64')}`;

html = html.replace(scriptTag[0], () => `<script type="module">${script}</script>`);
html = html.replace(styleTag[0], () => `<style>${styles}</style>`);
html = html.replace(iconTag[0], () => `<link rel="icon" type="image/svg+xml" href="${favicon}" />`);

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'index.html'), html);

console.log(`Standalone page written to standalone/index.html (${(Buffer.byteLength(html) / 1024).toFixed(1)} kB).`);
