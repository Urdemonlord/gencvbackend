const testCVData = {
  personalInfo: {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0123",
    location: "New York, NY",
    website: "https://johndoe.dev",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe"
  },
  summary: "Experienced software engineer with 5+ years building web applications",
  experience: [
    {
      id: "1",
      company: "Tech Corp",
      position: "Senior Software Engineer",
      location: "New York, NY",
      startDate: "2022-01",
      endDate: "Present",
      isCurrent: true,
      description: "Lead development of scalable web applications using React and Node.js",
      achievements: ["Increased team productivity by 30%", "Led migration to microservices"]
    }
  ],
  education: [
    {
      id: "1",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      institution: "University of Technology",
      location: "Boston, MA",
      startDate: "2015-09",
      endDate: "2019-05",
      gpa: "3.8"
    }
  ],
  skills: [
    { id: "1", name: "JavaScript", level: "Expert", category: "Technical" },
    { id: "2", name: "TypeScript", level: "Advanced", category: "Technical" },
    { id: "3", name: "React", level: "Expert", category: "Technical" },
    { id: "4", name: "Node.js", level: "Advanced", category: "Technical" },
    { id: "5", name: "Python", level: "Intermediate", category: "Technical" }
  ]
};

async function testPDFGeneration() {
  try {
    console.log('🚀 Testing PDF Generation API...');
    
    const response = await fetch('http://localhost:3000/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cvData: testCVData,
        template: 'modern'
      })
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error Response:', errorText);
      return;
    }

    const pdfBuffer = await response.arrayBuffer();
    console.log('✅ PDF Generated Successfully!');
    console.log('📄 PDF Size:', pdfBuffer.byteLength, 'bytes');
    
    // Save the PDF to test file
    const fs = require('fs');
    const path = require('path');
    
    const outputPath = path.join(__dirname, 'test-cv-output.pdf');
    fs.writeFileSync(outputPath, Buffer.from(pdfBuffer));
    console.log('💾 PDF saved to:', outputPath);
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

// Run the test
testPDFGeneration();
