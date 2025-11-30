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

// Add base tag for GitHub Pages subdirectory
// This ensures all relative paths in the JS bundle resolve correctly
if (!html.includes('<base')) {
  html = html.replace(/<head>/, '<head>\n    <base href="/4HC3/">');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Fixed paths in index.html for GitHub Pages');

// Also fix absolute paths in JavaScript bundles
const jsDir = path.join(distPath, '_expo', 'static', 'js', 'web');
if (fs.existsSync(jsDir)) {
  const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
  let fixedCount = 0;
  
  jsFiles.forEach(file => {
    const filePath = path.join(jsDir, file);
    let jsContent = fs.readFileSync(filePath, 'utf8');
    const originalContent = jsContent;
    
    // Replace absolute paths in the JS bundle
    // /assets/... -> ./assets/... or assets/...
    // This handles paths that might be in strings or require() calls
    jsContent = jsContent.replace(/["']\/(assets\/[^"']+)["']/g, '"./$1"');
    jsContent = jsContent.replace(/["']\/(_expo\/[^"']+)["']/g, '"./$1"');
    
    if (jsContent !== originalContent) {
      fs.writeFileSync(filePath, jsContent, 'utf8');
      fixedCount++;
    }
  });
  
  if (fixedCount > 0) {
    console.log(`Fixed paths in ${fixedCount} JavaScript bundle(s)`);
  }
}

