// PDF generation via Server Action
'use server';

import { CVData, CVTemplate } from '@gencv/types';
import { generateHTML } from '@gencv/utils/html-generator';

// Main function to generate a PDF
export async function generatePDF(cvData: CVData, template: CVTemplate): Promise<{ 
  buffer: Buffer; 
  isText: boolean;
  filename: string;
}> {
  const fullName = cvData.personalInfo?.fullName || 'cv';
  const safeFilename = fullName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  try {
    // Try to generate PDF with Puppeteer first
    try {
      console.log('Starting PDF generation process...');
      
      // Determine which puppeteer to use - for development environment, try regular puppeteer first
      let puppeteer;
      let usedPuppeteerType = 'puppeteer-core';
      
      if (process.env.NODE_ENV === 'development') {
        try {
          // Try to use regular puppeteer first in development
          const puppeteerModule = await import('puppeteer');
          puppeteer = puppeteerModule.default;
          usedPuppeteerType = 'puppeteer';
          console.log('Using regular puppeteer for PDF generation in development');
        } catch (err) {
          console.log('Regular puppeteer not available, falling back to puppeteer-core');
          const puppeteerCoreModule = await import('puppeteer-core');
          puppeteer = puppeteerCoreModule.default;
          usedPuppeteerType = 'puppeteer-core';
        }
      } else {
        // In production always use puppeteer-core
        const puppeteerCoreModule = await import('puppeteer-core');
        puppeteer = puppeteerCoreModule.default;
        console.log('Using puppeteer-core for PDF generation in production');
      }
      
      const { getPuppeteerConfig, initChromeFonts } = await import('@/lib/puppeteer-config');
      
      console.log('Generating PDF with', usedPuppeteerType);
      const html = await generateHTML(cvData, template);
      
      // Initialize Chromium
      await initChromeFonts();
      const puppeteerConfig = await getPuppeteerConfig();
      
      // Launch browser with proper config
      console.log('Launching browser with config:', JSON.stringify({
        executablePath: puppeteerConfig.executablePath ? 'Set' : 'Not set',
        headless: puppeteerConfig.headless || 'unknown',
        args: puppeteerConfig.args?.length || 0
      }));
      
      const browser = await puppeteer.launch(puppeteerConfig);
      
      try {
        // Create page and set HTML content
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        // Generate PDF
        const pdfData = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
          preferCSSPageSize: true,
        });
        
        // Validate PDF format
        const pdfBuffer = Buffer.from(pdfData);
        const signature = pdfBuffer.slice(0, 5).toString('utf-8');
        
        if (!signature.startsWith('%PDF')) {
          throw new Error(`Invalid PDF signature: ${signature}`);
        }
        
        console.log('PDF generated successfully, size:', pdfBuffer.length);
        
        return { 
          buffer: pdfBuffer, 
          isText: false,
          filename: `${safeFilename}.pdf`
        };
      } finally {
        // Always close browser
        await browser.close();
      }
    } catch (puppeteerError) {
      // Log puppeteer error but continue with fallback
      console.error('Puppeteer PDF generation failed:', puppeteerError);
      throw puppeteerError; // Re-throw to trigger fallback
    }
  } catch (error) {
    // Fall back to PDFKit-based text PDF
    console.log('Using PDFKit fallback due to error:', error);

    const textContent = `
CV - ${cvData.personalInfo?.fullName || 'Unnamed'}
===============================

PERSONAL INFORMATION
-------------------
Name: ${cvData.personalInfo?.fullName || ''}
Email: ${cvData.personalInfo?.email || ''}
Phone: ${cvData.personalInfo?.phone || ''}
Location: ${cvData.personalInfo?.location || ''}

PROFESSIONAL SUMMARY
-------------------
${cvData.professionalSummary || ''}

EXPERIENCE
---------
${cvData.experience?.map(exp =>
  `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate})
${exp.description}
${exp.achievements?.join('\n') || ''}`).join('\n\n') || ''}

EDUCATION
--------
${cvData.education?.map(edu =>
  `${edu.degree} in ${edu.fieldOfStudy}
${edu.institution} (${edu.startDate} - ${edu.endDate})
${edu.description || ''}`).join('\n\n') || ''}

SKILLS
------
${Array.isArray(cvData.skills) ? 
  cvData.skills.map(skill => `- ${skill.name} (${skill.level})`).join('\n') : 
  (cvData.skills ? 
    Object.entries(cvData.skills).map(([category, items]) => 
      `${category.toUpperCase()}:\n${Array.isArray(items) ? items.map(item => `- ${item}`).join('\n') : ''}`
    ).join('\n\n') : 
    ''
  )
}

PROJECTS
--------
${cvData.projects?.map(project =>
  `${project.name}
${project.description}
Technologies: ${project.technologies?.join(', ') || ''}
${project.url ? `URL: ${project.url}` : ''}
${project.githubUrl ? `GitHub: ${project.githubUrl}` : ''}`).join('\n\n') || ''}
    `;

    const textBuffer = Buffer.from(textContent, 'utf-8');

    return {
      buffer: textBuffer,
      isText: true,
      filename: `${safeFilename}.txt`
    };
  }
}
