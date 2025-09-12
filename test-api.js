#!/usr/bin/env node

/**
 * API Test Script for GenCV Backend
 * Test semua API endpoints dengan sample data
 */

const fs = require('fs');

// Test data
const sampleCVData = {
  personalInfo: {
    fullName: "Jane Smith",
    email: "jane.smith@example.com", 
    phone: "+1-555-123-4567",
    location: "New York, NY",
    linkedinUrl: "https://linkedin.com/in/janesmith",
    githubUrl: "https://github.com/janesmith"
  },
  professionalSummary: "Innovative software engineer with 7+ years of experience in developing scalable web applications. Proven track record in leading cross-functional teams and delivering high-quality products in fast-paced environments.",
  experience: [
    {
      id: "exp1",
      company: "TechCorp Solutions",
      position: "Senior Full Stack Developer", 
      startDate: "2020-03",
      endDate: "2024-01",
      location: "New York, NY",
      isCurrent: false,
      description: "Led development of enterprise-scale web applications using React and Node.js. Architected microservices infrastructure supporting 500K+ daily active users.",
      achievements: [
        "Increased application performance by 50% through code optimization",
        "Reduced deployment time from 2 hours to 15 minutes using CI/CD",
        "Mentored 8 junior developers and established coding standards"
      ]
    },
    {
      id: "exp2", 
      company: "StartupXYZ",
      position: "Frontend Developer",
      startDate: "2018-06",
      endDate: "2020-02", 
      location: "San Francisco, CA",
      isCurrent: false,
      description: "Built responsive web applications using modern JavaScript frameworks. Collaborated with UX designers to create intuitive user interfaces.",
      achievements: [
        "Developed mobile-first responsive designs for 10+ products",
        "Implemented automated testing reducing bugs by 40%"
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "Stanford University",
      degree: "Master of Science", 
      fieldOfStudy: "Computer Science",
      startDate: "2016-09",
      endDate: "2018-05",
      gpa: "3.9",
      description: "Focus on Machine Learning and Web Technologies. Thesis on scalable web architectures."
    }
  ],
  skills: [
    { id: "skill1", name: "JavaScript", level: "Expert", category: "Technical" },
    { id: "skill2", name: "React", level: "Expert", category: "Technical" },
    { id: "skill3", name: "Node.js", level: "Advanced", category: "Technical" },
    { id: "skill4", name: "Python", level: "Advanced", category: "Technical" },
    { id: "skill5", name: "AWS", level: "Intermediate", category: "Technical" },
    { id: "skill6", name: "Leadership", level: "Advanced", category: "Soft" },
    { id: "skill7", name: "Project Management", level: "Intermediate", category: "Soft" }
  ],
  projects: [
    {
      id: "proj1",
      name: "Real-time Chat Application", 
      description: "Built a scalable real-time chat application supporting 10K+ concurrent users using WebSocket technology and Redis for session management.",
      technologies: ["React", "Node.js", "Socket.io", "Redis", "MongoDB"],
      url: "https://chat-app-demo.com",
      githubUrl: "https://github.com/janesmith/chat-app",
      startDate: "2023-01",
      endDate: "2023-04"
    },
    {
      id: "proj2",
      name: "Data Analytics Dashboard",
      description: "Created an interactive dashboard for business intelligence with real-time data visualization and automated report generation.",
      technologies: ["Vue.js", "D3.js", "Express", "PostgreSQL", "Docker"], 
      githubUrl: "https://github.com/janesmith/analytics-dashboard",
      startDate: "2022-08",
      endDate: "2022-12"
    }
  ],
  languages: [
    { id: "lang1", name: "English", proficiency: "Native" },
    { id: "lang2", name: "French", proficiency: "Fluent" },
    { id: "lang3", name: "Spanish", proficiency: "Conversational" }
  ],
  certifications: [
    {
      id: "cert1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023-06",
      url: "https://aws.amazon.com/certification/"
    }
  ]
};

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

async function testPDFGeneration(baseUrl = 'http://localhost:3000') {
  log('\n📄 Testing PDF Generation API...', 'blue');
  
  try {
    const response = await fetch(`${baseUrl}/api/generate-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cvData: sampleCVData,
        template: 'modern'
      })
    });

    if (response.ok) {
      log('  ✅ PDF Generation API responding', 'green');
      log(`  📊 Response status: ${response.status}`, 'cyan');
      log(`  📏 Content length: ${response.headers.get('content-length') || 'unknown'}`, 'cyan');
      
      // Save PDF for testing
      const buffer = await response.arrayBuffer();
      const filename = `test-cv-${Date.now()}.pdf`;
      fs.writeFileSync(filename, Buffer.from(buffer));
      log(`  💾 PDF saved as: ${filename}`, 'green');
      
      return true;
    } else {
      log(`  ❌ PDF Generation failed with status: ${response.status}`, 'red');
      const errorText = await response.text();
      log(`  Error: ${errorText}`, 'red');
      return false;
    }
  } catch (error) {
    log(`  ❌ PDF Generation test failed: ${error.message}`, 'red');
    return false;
  }
}

async function testAIEnhancement(baseUrl = 'http://localhost:3000') {
  log('\n🤖 Testing AI Enhancement API...', 'blue');
  
  const testCases = [
    {
      type: 'summary',
      text: 'I am a developer with some experience.',
      context: { role: 'Software Developer', experienceLevel: 'mid-level' }
    },
    {
      type: 'experience', 
      text: 'I worked on various projects and helped the team.',
      context: { role: 'Frontend Developer', company: 'Tech Company' }
    },
    {
      type: 'skills',
      text: '',
      context: { role: 'Full Stack Developer', experienceLevel: 'senior' }
    }
  ];

  let passedTests = 0;

  for (const testCase of testCases) {
    try {
      log(`\n  🔍 Testing ${testCase.type} enhancement...`, 'cyan');
      
      const response = await fetch(`${baseUrl}/api/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase)
      });

      if (response.ok) {
        const result = await response.json();
        log(`    ✅ ${testCase.type} enhancement successful`, 'green');
        log(`    📝 Enhanced text length: ${result.enhancedText?.length || 0} chars`, 'cyan');
        
        if (result.enhancedText && result.enhancedText.length > 10) {
          log(`    🎯 Sample: "${result.enhancedText.substring(0, 50)}..."`, 'cyan');
          passedTests++;
        }
      } else {
        log(`    ❌ ${testCase.type} enhancement failed: ${response.status}`, 'red');
        const errorText = await response.text();
        log(`    Error: ${errorText}`, 'red');
      }
    } catch (error) {
      log(`    ❌ ${testCase.type} enhancement error: ${error.message}`, 'red');
    }
  }

  log(`\n  📊 AI Enhancement Results: ${passedTests}/${testCases.length} passed`, 
      passedTests === testCases.length ? 'green' : 'yellow');
  
  return passedTests === testCases.length;
}

async function testServerHealth(baseUrl = 'http://localhost:3000') {
  log('\n🏥 Testing Server Health...', 'blue');
  
  try {
    const response = await fetch(baseUrl);
    
    if (response.ok) {
      log('  ✅ Server is responding', 'green');
      log(`  📊 Response status: ${response.status}`, 'cyan');
      return true;
    } else {
      log(`  ⚠️  Server responding with status: ${response.status}`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`  ❌ Server health check failed: ${error.message}`, 'red');
    log('     Make sure server is running: npm run dev', 'yellow');
    return false;
  }
}

async function generateLoadTestData() {
  log('\n📊 Generating Load Test Data...', 'blue');
  
  const loadTestData = {
    timestamp: new Date().toISOString(),
    sampleRequests: {
      pdfGeneration: {
        method: 'POST',
        url: '/api/generate-pdf',
        body: sampleCVData,
        expectedResponseType: 'application/pdf'
      },
      aiEnhancement: {
        method: 'POST', 
        url: '/api/ai',
        body: {
          type: 'summary',
          text: 'Sample text for enhancement',
          context: { role: 'Developer' }
        },
        expectedResponseType: 'application/json'
      }
    },
    curlExamples: {
      pdfGeneration: `curl -X POST http://localhost:3000/api/generate-pdf \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify({ cvData: sampleCVData, template: 'modern' })}' \\
  --output generated-cv.pdf`,
      
      aiEnhancement: `curl -X POST http://localhost:3000/api/ai \\
  -H "Content-Type: application/json" \\
  -d '{"type":"summary","text":"I am a developer","context":{"role":"Developer"}}'`
    }
  };

  fs.writeFileSync('load-test-data.json', JSON.stringify(loadTestData, null, 2));
  log('  ✅ Load test data generated: load-test-data.json', 'green');
}

async function runAPITests() {
  log('🧪 GenCV Backend API Test Suite', 'blue');
  log('================================', 'blue');

  const baseUrl = process.argv[2] || 'http://localhost:3000';
  log(`🔗 Testing server: ${baseUrl}`, 'cyan');

  // Test server health first
  const serverHealthy = await testServerHealth(baseUrl);
  if (!serverHealthy) {
    log('\n❌ Server is not responding. Please start the server first:', 'red');
    log('   npm run dev', 'yellow');
    process.exit(1);
  }

  // Run API tests
  const tests = [];
  
  // Test PDF generation
  tests.push({
    name: 'PDF Generation',
    result: await testPDFGeneration(baseUrl)
  });

  // Test AI enhancement
  tests.push({
    name: 'AI Enhancement',
    result: await testAIEnhancement(baseUrl)
  });

  // Generate test data
  await generateLoadTestData();

  // Summary
  log('\n📊 API Test Results', 'blue');
  log('===================', 'blue');
  
  let passedTests = 0;
  tests.forEach(test => {
    const status = test.result ? '✅ PASS' : '❌ FAIL';
    const color = test.result ? 'green' : 'red';
    log(`  ${status} ${test.name}`, color);
    if (test.result) passedTests++;
  });

  log(`\nOverall: ${passedTests}/${tests.length} API tests passed`, 
      passedTests === tests.length ? 'green' : 'yellow');

  if (passedTests === tests.length) {
    log('\n🎉 All API tests passed! Your backend is working correctly.', 'green');
    log('\n🚀 Ready for production deployment!', 'green');
  } else {
    log('\n⚠️  Some API tests failed. Check server logs and configuration.', 'yellow');
    
    if (tests.find(t => t.name === 'AI Enhancement' && !t.result)) {
      log('\n💡 AI Enhancement failed? Check:', 'cyan');
      log('   - GEMINI_API_KEY is set in .env.local', 'yellow');
      log('   - API key is valid and has proper permissions', 'yellow');
      log('   - Internet connection is working', 'yellow');
    }
  }

  log('\n📋 Test artifacts generated:', 'blue');
  log('  - test-cv-*.pdf (generated PDF samples)', 'cyan');
  log('  - load-test-data.json (load testing data)', 'cyan');
}

// Run tests
runAPITests().catch(console.error);
