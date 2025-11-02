const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const basePath = '/All-News-2.0';

function updateHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      updateHtmlFiles(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix script src paths
      content = content.replace(/src="\/_expo\//g, `src="${basePath}/_expo/`);
      
      // Fix href paths for assets
      content = content.replace(/href="\/favicon\.ico"/g, `href="${basePath}/favicon.ico"`);
      content = content.replace(/href="\/assets\//g, `href="${basePath}/assets/`);
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  });
}

console.log('Fixing asset paths in HTML files...');
updateHtmlFiles(distDir);
console.log('Done!');
