const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('index.html not found in dist directory');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Replace absolute paths with relative paths for GitHub Pages
// /_expo/... -> ./_expo/...
// /favicon.ico -> ./favicon.ico
html = html.replace(/href="\/([^"]+)"/g, 'href="./$1"');
html = html.replace(/src="\/([^"]+)"/g, 'src="./$1"');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Fixed paths in index.html for GitHub Pages');

