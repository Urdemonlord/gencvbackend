const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing workspace packages for Vercel build...');

// Copy workspace packages to apps/web/node_modules
const packages = ['types', 'utils', 'lib-ai', 'ui'];
const webDir = path.join(__dirname, '..', 'apps', 'web');
const nodeModulesDir = path.join(webDir, 'node_modules', '@gencv');

// Ensure @gencv directory exists
if (!fs.existsSync(nodeModulesDir)) {
  fs.mkdirSync(nodeModulesDir, { recursive: true });
}

packages.forEach(pkg => {
  const src = path.join(__dirname, '..', 'packages', pkg);
  const dest = path.join(nodeModulesDir, pkg);
  
  if (fs.existsSync(src)) {
    // Remove existing
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true, force: true });
    }
    
    // Copy package
    fs.cpSync(src, dest, { recursive: true });
    console.log(`✅ Copied packages/${pkg} to @gencv/${pkg}`);
  } else {
    console.log(`⚠️  Package ${pkg} not found in packages/`);
  }
});

// Copy package.json files and ensure they have proper exports
packages.forEach(pkg => {
  const pkgPath = path.join(nodeModulesDir, pkg, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const packageJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    
    // Ensure proper exports for Node.js resolution
    if (!packageJson.main && !packageJson.exports) {
      packageJson.main = 'index.ts';
      packageJson.exports = {
        '.': './index.ts',
        './*': './*'
      };
      fs.writeFileSync(pkgPath, JSON.stringify(packageJson, null, 2));
      console.log(`🔧 Updated exports for @gencv/${pkg}`);
    }
  }
});

console.log('🎉 Workspace packages prepared for Vercel build!');
