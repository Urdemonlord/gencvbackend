const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing workspace packages for Vercel build...');
console.log('Current working directory:', process.cwd());

// Copy workspace packages to apps/web/node_modules
const packages = ['types', 'utils', 'lib-ai', 'ui'];
const webDir = path.join(__dirname, '..', 'apps', 'web');
const nodeModulesDir = path.join(webDir, 'node_modules', '@gencv');

console.log('Web directory:', webDir);
console.log('Target node_modules:', nodeModulesDir);

// Ensure @gencv directory exists
if (!fs.existsSync(nodeModulesDir)) {
  fs.mkdirSync(nodeModulesDir, { recursive: true });
  console.log('✅ Created @gencv directory');
}

packages.forEach(pkg => {
  const src = path.join(__dirname, '..', 'packages', pkg);
  const dest = path.join(nodeModulesDir, pkg);
  
  console.log(`Processing package: ${pkg}`);
  console.log(`  Source: ${src}`);
  console.log(`  Destination: ${dest}`);
  
  if (fs.existsSync(src)) {
    // Remove existing
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true, force: true });
      console.log(`  ♻️  Removed existing ${pkg}`);
    }
    
    // Copy package
    try {
      fs.cpSync(src, dest, { recursive: true });
      console.log(`  ✅ Copied packages/${pkg} to @gencv/${pkg}`);
    } catch (error) {
      console.error(`  ❌ Failed to copy ${pkg}:`, error.message);
      process.exit(1);
    }
  } else {
    console.warn(`  ⚠️  Source package ${pkg} not found at ${src}`);
  }
});

// Copy package.json files and ensure they have proper exports
packages.forEach(pkg => {
  const pkgPath = path.join(nodeModulesDir, pkg, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      
      // Ensure proper exports based on package
      if (!packageJson.main) {
        packageJson.main = './index.ts';
      }
      if (!packageJson.types) {
        packageJson.types = './index.ts';
      }
      
      // Don't override existing exports, just ensure basic ones exist
      if (!packageJson.exports) {
        packageJson.exports = {
          ".": {
            "types": "./index.ts", 
            "require": "./index.ts",
            "import": "./index.ts"
          }
        };
      }
      
      fs.writeFileSync(pkgPath, JSON.stringify(packageJson, null, 2));
      console.log(`  ✅ Updated package.json for ${pkg}`);
    } catch (error) {
      console.error(`  ⚠️  Failed to update package.json for ${pkg}:`, error.message);
    }
  }
});

console.log('🎉 Workspace packages prepared for Vercel build!');
try {
  const availablePackages = fs.readdirSync(nodeModulesDir);
  console.log('📁 Available packages:', availablePackages);
} catch (error) {
  console.error('❌ Failed to list available packages:', error.message);
}
