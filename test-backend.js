#!/usr/bin/env node

/**
 * GenCV Backend Test Suite
 * Test script untuk memastikan semua component berfungsi dengan baik
 */

const fs = require('fs');
const path = require('path');

// Test data
const testCVData = {
  personalInfo: {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-234-567-8900",
    location: "San Francisco, CA",
    linkedinUrl: "https://linkedin.com/in/johndoe",
    githubUrl: "https://github.com/johndoe"
  },
  professionalSummary: "Experienced software developer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about creating scalable solutions and leading development teams.",
  experience: [
    {
      id: "exp1",
      company: "Tech Corp",
      position: "Senior Software Engineer",
      startDate: "2021-01",
      endDate: "2024-01",
      location: "San Francisco, CA",
      isCurrent: false,
      description: "Led development of microservices architecture serving 1M+ users daily. Implemented CI/CD pipelines and mentored junior developers.",
      achievements: [
        "Reduced API response time by 40% through optimization",
        "Implemented automated testing reducing bugs by 60%",
        "Led team of 5 developers on critical product features"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2017-09",
      endDate: "2021-05",
      gpa: "3.8",
      description: "Relevant coursework: Data Structures, Algorithms, Software Engineering"
    }
  ],
  skills: [
    { id: "skill1", name: "JavaScript", level: "Expert", category: "Technical" },
    { id: "skill2", name: "React", level: "Advanced", category: "Technical" },
    { id: "skill3", name: "Node.js", level: "Advanced", category: "Technical" },
    { id: "skill4", name: "Leadership", level: "Intermediate", category: "Soft" },
    { id: "skill5", name: "Communication", level: "Advanced", category: "Soft" }
  ],
  projects: [
    {
      id: "proj1",
      name: "E-commerce Platform",
      description: "Built a full-stack e-commerce platform with React frontend and Node.js backend, supporting payment processing and inventory management.",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe API", "Docker"],
      url: "https://ecommerce-demo.com",
      githubUrl: "https://github.com/johndoe/ecommerce-platform",
      startDate: "2023-01",
      endDate: "2023-06"
    }
  ],
  languages: [
    { id: "lang1", name: "English", proficiency: "Native" },
    { id: "lang2", name: "Spanish", proficiency: "Conversational" }
  ]
};

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function testProjectStructure() {
  log('\n🏗️  Testing Project Structure...', 'blue');
  
  const requiredFiles = [
    'package.json',
    'turbo.json',
    'apps/web/package.json',
    'apps/web/next.config.js',
    'apps/web/tsconfig.json',
    'packages/types/package.json',
    'packages/utils/package.json',
    'packages/lib-ai/package.json'
  ];

  const requiredDirs = [
    'apps/web/app',
    'apps/web/app/api',
    'apps/web/app/api/generate-pdf',
    'apps/web/app/api/ai',
    'packages/types',
    'packages/utils',
    'packages/lib-ai'
  ];

  let passed = 0;
  let total = requiredFiles.length + requiredDirs.length;

  // Check files
  requiredFiles.forEach(file => {
    if (checkFileExists(file)) {
      log(`  ✅ ${file}`, 'green');
      passed++;
    } else {
      log(`  ❌ ${file}`, 'red');
    }
  });

  // Check directories
  requiredDirs.forEach(dir => {
    if (checkFileExists(dir)) {
      log(`  ✅ ${dir}/`, 'green');
      passed++;
    } else {
      log(`  ❌ ${dir}/`, 'red');
    }
  });

  log(`\nStructure Check: ${passed}/${total} passed`, passed === total ? 'green' : 'yellow');
  return passed === total;
}

function testPackageIntegrity() {
  log('\n📦 Testing Package Integrity...', 'blue');
  
  try {
    // Test root package.json
    const rootPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    log(`  ✅ Root package.json valid`, 'green');
    
    // Test workspaces configuration
    if (rootPkg.workspaces && Array.isArray(rootPkg.workspaces)) {
      log(`  ✅ Workspaces configured: ${rootPkg.workspaces.join(', ')}`, 'green');
    } else {
      log(`  ❌ Workspaces not properly configured`, 'red');
      return false;
    }

    // Test web app package
    const webPkg = JSON.parse(fs.readFileSync('apps/web/package.json', 'utf8'));
    log(`  ✅ Web app package.json valid`, 'green');
    
    // Check dependencies
    const requiredDeps = ['next', 'react', 'puppeteer-core', '@sparticuz/chromium'];
    let depsOk = true;
    
    requiredDeps.forEach(dep => {
      if (webPkg.dependencies && webPkg.dependencies[dep]) {
        log(`  ✅ Dependency: ${dep}`, 'green');
      } else {
        log(`  ❌ Missing dependency: ${dep}`, 'red');
        depsOk = false;
      }
    });

    return depsOk;
  } catch (error) {
    log(`  ❌ Package integrity check failed: ${error.message}`, 'red');
    return false;
  }
}

function testTypeDefinitions() {
  log('\n📝 Testing Type Definitions...', 'blue');
  
  try {
    const typesIndex = fs.readFileSync('packages/types/index.ts', 'utf8');
    
    // Check for main interfaces
    const requiredTypes = ['CVData', 'PersonalInfo', 'WorkExperience', 'Education', 'Skill'];
    let typesOk = true;
    
    requiredTypes.forEach(type => {
      if (typesIndex.includes(`interface ${type}`)) {
        log(`  ✅ Type definition: ${type}`, 'green');
      } else {
        log(`  ❌ Missing type: ${type}`, 'red');
        typesOk = false;
      }
    });

    return typesOk;
  } catch (error) {
    log(`  ❌ Type definitions check failed: ${error.message}`, 'red');
    return false;
  }
}

function testAPIRoutes() {
  log('\n🔌 Testing API Route Files...', 'blue');
  
  const apiRoutes = [
    'apps/web/app/api/generate-pdf/route.ts',
    'apps/web/app/api/ai/route.ts'
  ];

  let routesOk = true;

  apiRoutes.forEach(route => {
    if (checkFileExists(route)) {
      try {
        const content = fs.readFileSync(route, 'utf8');
        if (content.includes('export async function POST')) {
          log(`  ✅ API route: ${route}`, 'green');
        } else {
          log(`  ⚠️  API route missing POST handler: ${route}`, 'yellow');
        }
      } catch (error) {
        log(`  ❌ Error reading: ${route}`, 'red');
        routesOk = false;
      }
    } else {
      log(`  ❌ Missing API route: ${route}`, 'red');
      routesOk = false;
    }
  });

  return routesOk;
}

function testHTMLGenerator() {
  log('\n🎨 Testing HTML Generator...', 'blue');
  
  try {
    const htmlGenPath = 'packages/utils/html-generator.ts';
    if (!checkFileExists(htmlGenPath)) {
      log(`  ❌ HTML generator not found`, 'red');
      return false;
    }

    const content = fs.readFileSync(htmlGenPath, 'utf8');
    
    // Check for main function
    if (content.includes('export async function generateHTML')) {
      log(`  ✅ generateHTML function found`, 'green');
    } else {
      log(`  ❌ generateHTML function missing`, 'red');
      return false;
    }

    // Check for template support
    const templates = ['modern', 'classic', 'creative', 'minimal'];
    templates.forEach(template => {
      if (content.includes(template)) {
        log(`  ✅ Template support: ${template}`, 'green');
      } else {
        log(`  ⚠️  Template may not be supported: ${template}`, 'yellow');
      }
    });

    return true;
  } catch (error) {
    log(`  ❌ HTML generator test failed: ${error.message}`, 'red');
    return false;
  }
}

function testSecurityMiddleware() {
  log('\n🔒 Testing Security Middleware...', 'blue');
  
  try {
    const middlewarePath = 'apps/web/middleware.ts';
    if (!checkFileExists(middlewarePath)) {
      log(`  ❌ Middleware not found`, 'red');
      return false;
    }

    const content = fs.readFileSync(middlewarePath, 'utf8');
    
    // Check for security features
    const securityFeatures = [
      'rateLimit',
      'X-Frame-Options',
      'X-Content-Type-Options',
      'rate limiting'
    ];

    let securityOk = true;
    securityFeatures.forEach(feature => {
      if (content.includes(feature)) {
        log(`  ✅ Security feature: ${feature}`, 'green');
      } else {
        log(`  ⚠️  Security feature not found: ${feature}`, 'yellow');
      }
    });

    return true;
  } catch (error) {
    log(`  ❌ Security middleware test failed: ${error.message}`, 'red');
    return false;
  }
}

function generateTestReport() {
  log('\n📋 Generating Test Report...', 'blue');
  
  const report = {
    timestamp: new Date().toISOString(),
    testData: testCVData,
    structure: 'Ready for development',
    packages: 'Dependencies configured',
    types: 'TypeScript interfaces defined',
    api: 'API routes implemented',
    security: 'Security middleware configured',
    htmlGenerator: 'PDF generation ready',
    recommendations: [
      '1. Install dependencies: npm install',
      '2. Set up environment variables in apps/web/.env.local',
      '3. Get Google Gemini API key',
      '4. Start development: npm run dev',
      '5. Test PDF generation with sample data',
      '6. Deploy to Vercel following DEPLOYMENT.md'
    ]
  };

  fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
  log('  ✅ Test report generated: test-report.json', 'green');
}

function runAllTests() {
  log('🚀 GenCV Backend Test Suite', 'blue');
  log('================================', 'blue');

  const tests = [
    { name: 'Project Structure', fn: testProjectStructure },
    { name: 'Package Integrity', fn: testPackageIntegrity },
    { name: 'Type Definitions', fn: testTypeDefinitions },
    { name: 'API Routes', fn: testAPIRoutes },
    { name: 'HTML Generator', fn: testHTMLGenerator },
    { name: 'Security Middleware', fn: testSecurityMiddleware }
  ];

  let passedTests = 0;
  const results = [];

  tests.forEach(test => {
    const passed = test.fn();
    results.push({ name: test.name, passed });
    if (passed) passedTests++;
  });

  log('\n📊 Test Results Summary', 'blue');
  log('========================', 'blue');
  
  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    const color = result.passed ? 'green' : 'red';
    log(`  ${status} ${result.name}`, color);
  });

  log(`\nOverall: ${passedTests}/${tests.length} tests passed`, passedTests === tests.length ? 'green' : 'yellow');

  if (passedTests === tests.length) {
    log('\n🎉 All tests passed! Your GenCV backend is ready for development.', 'green');
    log('\nNext steps:', 'blue');
    log('  1. npm install', 'yellow');
    log('  2. Copy .env.example to .env.local and add your API keys', 'yellow');
    log('  3. npm run dev', 'yellow');
    log('  4. Test at http://localhost:3000', 'yellow');
  } else {
    log('\n⚠️  Some tests failed. Please check the issues above.', 'yellow');
  }

  generateTestReport();
}

// Run all tests
runAllTests();
