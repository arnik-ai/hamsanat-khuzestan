// Builds one self-contained HTML file (font, styles and scripts inlined) that can be sent by email or messenger.
// Run from anywhere: node tools/build-single.js
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');

let html = read('index.html');
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, href) => `<style>\n${read(href)}\n</style>`);
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => `<script>\n${read(src).replace(/<\/script/gi, '<\\/script')}\n</script>`);

const out = path.join(root, 'hamsanat-khuzestan-demo.html');
fs.writeFileSync(out, html);
console.log(`wrote ${path.basename(out)} (${Math.round(fs.statSync(out).size / 1024)} KB)`);
