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

// Fix absolute paths in JavaScript bundles - use a very aggressive approach
const jsDir = path.join(distPath, '_expo', 'static', 'js', 'web');
if (fs.existsSync(jsDir)) {
  const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
  let fixedCount = 0;
  let totalReplacements = 0;
  
  jsFiles.forEach(file => {
    const filePath = path.join(jsDir, file);
    let jsContent = fs.readFileSync(filePath, 'utf8');
    const originalContent = jsContent;
    
    // Count replacements for debugging
    let replacements = 0;
    
    // Very aggressive replacement - replace ALL instances of /assets/ and /_expo/ with ./
    // This handles all possible formats: strings, template literals, require(), etc.
    
    // Pattern 1: In double quotes: "/assets/..." or "/_expo/..."
    const pattern1 = /"(\/)(assets\/[^"]+)"/g;
    const matches1 = jsContent.match(pattern1);
    if (matches1) replacements += matches1.length;
    jsContent = jsContent.replace(pattern1, '"./$2"');
    
    // Pattern 2: In single quotes: '/assets/...' or '/_expo/...'
    const pattern2 = /'(\/)(assets\/[^']+)'/g;
    const matches2 = jsContent.match(pattern2);
    if (matches2) replacements += matches2.length;
    jsContent = jsContent.replace(pattern2, "'./$2'");
    
    // Pattern 3: In template literals: `/assets/...` or `/_expo/...`
    const pattern3 = /`(\/)(assets\/[^`]+)`/g;
    const matches3 = jsContent.match(pattern3);
    if (matches3) replacements += matches3.length;
    jsContent = jsContent.replace(pattern3, '`./$2`');
    
    // Pattern 4: For _expo paths
    const pattern4 = /"(\/)(_expo\/[^"]+)"/g;
    const matches4 = jsContent.match(pattern4);
    if (matches4) replacements += matches4.length;
    jsContent = jsContent.replace(pattern4, '"./$2"');
    
    const pattern5 = /'(\/)(_expo\/[^']+)'/g;
    const matches5 = jsContent.match(pattern5);
    if (matches5) replacements += matches5.length;
    jsContent = jsContent.replace(pattern5, "'./$2'");
    
    const pattern6 = /`(\/)(_expo\/[^`]+)`/g;
    const matches6 = jsContent.match(pattern6);
    if (matches6) replacements += matches6.length;
    jsContent = jsContent.replace(pattern6, '`./$2`');
    
    // Pattern 7: Handle paths that might not be in quotes (like in require or import)
    // This is more aggressive and might catch edge cases
    jsContent = jsContent.replace(/([^"'])\/(assets\/[^\s"'`,\)]+)/g, '$1./$2');
    jsContent = jsContent.replace(/([^"'])\/(_expo\/[^\s"'`,\)]+)/g, '$1./$2');
    
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
