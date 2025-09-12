#!/usr/bin/env node

/**
 * GenCV Backend Setup Script
 * Automated setup untuk GenCV backend system
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Color codes
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function executeCommand(command, description) {
  try {
    log(`\n🔄 ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} completed`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} failed: ${error.message}`, 'red');
    return false;
  }
}

function createEnvFile() {
  log('\n📝 Setting up environment variables...', 'blue');
  
  const envPath = path.join('apps', 'web', '.env.local');
  const examplePath = path.join('apps', 'web', '.env.example');
  
  if (fs.existsSync(envPath)) {
    log('  ⚠️  .env.local already exists, skipping...', 'yellow');
    return true;
  }
  
  try {
    const exampleContent = fs.readFileSync(examplePath, 'utf8');
    fs.writeFileSync(envPath, exampleContent);
    log('  ✅ .env.local created from .env.example', 'green');
    log('  ⚠️  Please edit apps/web/.env.local and add your API keys:', 'yellow');
    log('     - GEMINI_API_KEY: Get from https://makersuite.google.com/app/apikey', 'cyan');
    log('     - API_SECRET_KEY: Generate a random secret key', 'cyan');
    return true;
  } catch (error) {
    log(`  ❌ Failed to create .env.local: ${error.message}`, 'red');
    return false;
  }
}

function displayGeminiSetupInstructions() {
  log('\n🔑 Google Gemini API Setup Instructions:', 'blue');
  log('==========================================', 'blue');
  log('1. Go to https://makersuite.google.com/app/apikey', 'cyan');
  log('2. Click "Create API Key"', 'cyan');
  log('3. Copy the generated API key', 'cyan');
  log('4. Add it to your .env.local file as GEMINI_API_KEY=your_key_here', 'cyan');
  log('5. Save the file and restart the dev server', 'cyan');
}

function displayNextSteps() {
  log('\n🎉 Setup Complete!', 'green');
  log('==================', 'green');
  log('\nNext steps to get started:', 'blue');
  log('1. Add your Google Gemini API key to apps/web/.env.local', 'yellow');
  log('2. Start development server: npm run dev', 'yellow');
  log('3. Open browser: http://localhost:3000', 'yellow');
  log('4. Test PDF generation with the API endpoints', 'yellow');
  log('\nAPI Endpoints:', 'blue');
  log('• POST /api/generate-pdf - Generate PDF from CV data', 'cyan');
  log('• POST /api/ai - AI content enhancement', 'cyan');
  log('\nDocumentation:', 'blue');
  log('• README.md - Complete documentation', 'cyan');
  log('• DEPLOYMENT.md - Deployment guide', 'cyan');
  log('• test-report.json - Latest test results', 'cyan');
}

function checkNodeVersion() {
  log('\n🔍 Checking Node.js version...', 'blue');
  
  try {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion >= 18) {
      log(`  ✅ Node.js ${nodeVersion} (compatible)`, 'green');
      return true;
    } else {
      log(`  ❌ Node.js ${nodeVersion} (requires Node.js 18+)`, 'red');
      log('     Please upgrade Node.js: https://nodejs.org/', 'yellow');
      return false;
    }
  } catch (error) {
    log(`  ❌ Could not check Node.js version: ${error.message}`, 'red');
    return false;
  }
}

function checkNpmVersion() {
  log('\n🔍 Checking npm version...', 'blue');
  
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(npmVersion.split('.')[0]);
    
    if (majorVersion >= 8) {
      log(`  ✅ npm ${npmVersion} (compatible)`, 'green');
      return true;
    } else {
      log(`  ❌ npm ${npmVersion} (requires npm 8+)`, 'red');
      log('     Please upgrade npm: npm install -g npm@latest', 'yellow');
      return false;
    }
  } catch (error) {
    log(`  ❌ Could not check npm version: ${error.message}`, 'red');
    return false;
  }
}

function runSetup() {
  log('🚀 GenCV Backend Setup', 'blue');
  log('=====================', 'blue');
  
  // Check prerequisites
  if (!checkNodeVersion() || !checkNpmVersion()) {
    log('\n❌ Prerequisites not met. Please fix the issues above and try again.', 'red');
    process.exit(1);
  }
  
  // Install dependencies
  if (!executeCommand('npm install', 'Installing dependencies')) {
    log('\n❌ Setup failed at dependency installation.', 'red');
    process.exit(1);
  }
  
  // Run type check
  if (!executeCommand('npm run type-check', 'Running type checks')) {
    log('\n⚠️  Type check failed, but continuing setup...', 'yellow');
  }
  
  // Create environment file
  createEnvFile();
  
  // Display setup instructions
  displayGeminiSetupInstructions();
  displayNextSteps();
  
  log('\n✨ GenCV Backend is ready for development!', 'green');
  log('\nHappy coding! 🎯', 'cyan');
}

// Run setup
runSetup();
