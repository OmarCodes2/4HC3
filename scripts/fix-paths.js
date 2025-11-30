const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('index.html not found in dist directory');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Remove base tag if it exists (we'll use relative paths instead)
html = html.replace(/<base[^>]*>/gi, '');

// Replace absolute paths with relative paths for GitHub Pages
html = html.replace(/href="\/([^"]+)"/g, 'href="./$1"');
html = html.replace(/src="\/([^"]+)"/g, 'src="./$1"');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Fixed paths in index.html for GitHub Pages');

// Fix absolute paths in JavaScript bundles
const jsDir = path.join(distPath, '_expo', 'static', 'js', 'web');
if (fs.existsSync(jsDir)) {
  const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
  let fixedCount = 0;
  let totalReplacements = 0;
  
  jsFiles.forEach(file => {
    const filePath = path.join(jsDir, file);
    let jsContent = fs.readFileSync(filePath, 'utf8');
    const originalContent = jsContent;
    
    let replacements = 0;
    
    // Only replace paths that start with /assets/ or /_expo/ (not paths that contain them)
    // Pattern: " or ' followed by /assets/ or /_expo/ at the start of a path
    // This prevents replacing /assets/ when it appears in the middle of a path
    
    // Replace "/assets/..." with "./assets/..."
    const pattern1 = /(["'])\/(assets\/[^"']+)\1/g;
    const matches1 = jsContent.match(pattern1);
    if (matches1) {
      replacements += matches1.length;
      jsContent = jsContent.replace(pattern1, '$1./$2$1');
    }
    
    // Replace '/assets/...' with './assets/...'
    const pattern2 = /(['"])\/(assets\/[^'"]+)\1/g;
    const matches2 = jsContent.match(pattern2);
    if (matches2 && matches2.length > (matches1 ? matches1.length : 0)) {
      // Only count additional matches
      const additional = matches2.length - (matches1 ? matches1.length : 0);
      replacements += additional;
    }
    
    // Replace "/_expo/..." with "./_expo/..."
    const pattern3 = /(["'])\/(_expo\/[^"']+)\1/g;
    const matches3 = jsContent.match(pattern3);
    if (matches3) {
      replacements += matches3.length;
      jsContent = jsContent.replace(pattern3, '$1./$2$1');
    }
    
    // Also handle cases where the path might not be in quotes but is clearly a path
    // Look for patterns like :"/assets/ or ="/assets/ or ("/assets/
    jsContent = jsContent.replace(/([:=(])\/(assets\/[^\s"'`,\)]+)/g, '$1./$2');
    jsContent = jsContent.replace(/([:=(])\/(_expo\/[^\s"'`,\)]+)/g, '$1./$2');
    
    if (jsContent !== originalContent) {
      fs.writeFileSync(filePath, jsContent, 'utf8');
      fixedCount++;
      totalReplacements += replacements;
      console.log(`  Fixed ${replacements} path(s) in ${file}`);
    }
  });
  
  if (fixedCount > 0) {
    console.log(`Fixed paths in ${fixedCount} JavaScript bundle(s) (${totalReplacements} total replacements)`);
  } else {
    console.log('No paths found to fix in JavaScript bundles');
  }
}
