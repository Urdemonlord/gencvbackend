import { CVData, CVTemplate } from '@gencv/types';

// HTML template generator for PDF conversion
export async function generateHTML(cvData: CVData, template: CVTemplate = 'modern'): Promise<string> {
  const styles = generateStyles(template);
  const content = generateContent(cvData, template);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - ${cvData.personalInfo?.fullName || 'Resume'}</title>
    <style>
        ${styles}
    </style>
</head>
<body>
    <div class="cv-container">
        ${content}
    </div>
</body>
</html>
  `;
}

// Generate CSS styles based on template
function generateStyles(template: CVTemplate): string {
  const baseStyles = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.5;
        color: #333;
        background: white;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
    
    .cv-container {
        max-width: 21cm;
        margin: 0 auto;
        padding: 2cm 1.5cm;
        background: white;
        min-height: 29.7cm;
    }
    
    .header {
        text-align: center;
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 2px solid #e5e7eb;
    }
    
    .name {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 0.5rem;
    }
    
    .contact-info {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 1rem;
        font-size: 0.95rem;
        color: #6b7280;
    }
    
    .contact-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .section {
        margin-bottom: 2rem;
    }
    
    .section-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #e5e7eb;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    .summary {
        font-size: 1rem;
        line-height: 1.6;
        color: #4b5563;
    }
    
    .experience-item, .education-item, .project-item {
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #f3f4f6;
    }
    
    .experience-item:last-child,
    .education-item:last-child,
    .project-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }
    
    .item-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 0.5rem;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .item-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: #1f2937;
    }
    
    .item-subtitle {
        font-size: 1rem;
        color: #6b7280;
        font-weight: 500;
    }
    
    .item-date {
        font-size: 0.9rem;
        color: #6b7280;
        font-weight: 500;
        text-align: right;
    }
    
    .item-description {
        font-size: 0.95rem;
        line-height: 1.5;
        color: #4b5563;
        margin-top: 0.5rem;
    }
    
    .achievements {
        list-style: none;
        margin-top: 0.5rem;
    }
    
    .achievements li {
        position: relative;
        padding-left: 1rem;
        margin-bottom: 0.25rem;
        font-size: 0.95rem;
        line-height: 1.5;
        color: #4b5563;
    }
    
    .achievements li:before {
        content: "•";
        color: #3b82f6;
        font-weight: bold;
        position: absolute;
        left: 0;
    }
    
    .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .skill-category {
        margin-bottom: 1rem;
    }
    
    .skill-category-title {
        font-size: 1rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 0.5rem;
    }
    
    .skill-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.25rem 0;
        font-size: 0.9rem;
    }
    
    .skill-name {
        color: #4b5563;
    }
    
    .skill-level {
        color: #6b7280;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .technologies {
        margin-top: 0.5rem;
        font-size: 0.9rem;
        color: #6b7280;
    }
    
    .tech-tag {
        display: inline-block;
        background: #f3f4f6;
        color: #374151;
        padding: 0.2rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.8rem;
        margin-right: 0.5rem;
        margin-bottom: 0.25rem;
    }
    
    @media print {
        .cv-container {
            margin: 0;
            padding: 1cm;
            box-shadow: none;
        }
        
        .section {
            page-break-inside: avoid;
        }
        
        .experience-item,
        .education-item,
        .project-item {
            page-break-inside: avoid;
        }
    }
  `;

  // Template-specific styles
  const templateStyles = {
    modern: `
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 2rem;
        margin: -2cm -1.5cm 2rem -1.5cm;
        border-bottom: none;
      }
      
      .name {
        color: white;
      }
      
      .contact-info {
        color: rgba(255, 255, 255, 0.9);
      }
      
      .section-title {
        color: #667eea;
        border-bottom-color: #667eea;
      }
      
      .achievements li:before {
        color: #667eea;
      }
    `,
    classic: `
      .header {
        border-bottom: 3px solid #1f2937;
      }
      
      .section-title {
        color: #1f2937;
        border-bottom-color: #1f2937;
      }
    `,
    creative: `
      .cv-container {
        background: linear-gradient(45deg, #f8fafc 0%, #e2e8f0 100%);
      }
      
      .header {
        background: #1a202c;
        color: white;
        transform: skewY(-2deg);
        padding: 2rem;
        margin: -2cm -1.5cm 2rem -1.5cm;
      }
      
      .header > * {
        transform: skewY(2deg);
      }
      
      .section {
        background: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
    `,
    minimal: `
      .header {
        border-bottom: 1px solid #e5e7eb;
      }
      
      .section-title {
        font-size: 1rem;
        font-weight: 500;
        text-transform: none;
        letter-spacing: normal;
      }
      
      .experience-item,
      .education-item,
      .project-item {
        border-bottom: none;
        margin-bottom: 1rem;
      }
    `
  };

  return baseStyles + (templateStyles[template] || templateStyles.modern);
}

// Generate HTML content based on CV data
function generateContent(cvData: CVData, template: CVTemplate): string {
  const { personalInfo, professionalSummary, experience, education, skills, projects, languages, certifications } = cvData;

  let content = '';

  // Header with personal info
  if (personalInfo) {
    content += `
      <header class="header">
        <h1 class="name">${personalInfo.fullName}</h1>
        <div class="contact-info">
          ${personalInfo.email ? `<span class="contact-item">✉ ${personalInfo.email}</span>` : ''}
          ${personalInfo.phone ? `<span class="contact-item">📞 ${personalInfo.phone}</span>` : ''}
          ${personalInfo.location ? `<span class="contact-item">📍 ${personalInfo.location}</span>` : ''}
          ${personalInfo.linkedinUrl ? `<span class="contact-item">🔗 LinkedIn</span>` : ''}
          ${personalInfo.githubUrl ? `<span class="contact-item">🐙 GitHub</span>` : ''}
          ${personalInfo.websiteUrl ? `<span class="contact-item">🌐 Website</span>` : ''}
        </div>
      </header>
    `;
  }

  // Professional Summary
  if (professionalSummary) {
    content += `
      <section class="section">
        <h2 class="section-title">Professional Summary</h2>
        <p class="summary">${professionalSummary}</p>
      </section>
    `;
  }

  // Work Experience
  if (experience && experience.length > 0) {
    content += `
      <section class="section">
        <h2 class="section-title">Experience</h2>
        ${experience.map(exp => `
          <div class="experience-item">
            <div class="item-header">
              <div>
                <div class="item-title">${exp.position}</div>
                <div class="item-subtitle">${exp.company} • ${exp.location}</div>
              </div>
              <div class="item-date">
                ${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate}
              </div>
            </div>
            <div class="item-description">${exp.description}</div>
            ${exp.achievements && exp.achievements.length > 0 ? `
              <ul class="achievements">
                ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </section>
    `;
  }

  // Education
  if (education && education.length > 0) {
    content += `
      <section class="section">
        <h2 class="section-title">Education</h2>
        ${education.map(edu => `
          <div class="education-item">
            <div class="item-header">
              <div>
                <div class="item-title">${edu.degree} in ${edu.fieldOfStudy}</div>
                <div class="item-subtitle">${edu.institution}</div>
              </div>
              <div class="item-date">${edu.startDate} - ${edu.endDate}</div>
            </div>
            ${edu.gpa ? `<div class="item-description">GPA: ${edu.gpa}</div>` : ''}
            ${edu.description ? `<div class="item-description">${edu.description}</div>` : ''}
          </div>
        `).join('')}
      </section>
    `;
  }

  // Skills
  if (skills && skills.length > 0) {
    const skillsByCategory = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, typeof skills>);

    content += `
      <section class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-grid">
          ${Object.entries(skillsByCategory).map(([category, categorySkills]) => `
            <div class="skill-category">
              <div class="skill-category-title">${category}</div>
              ${categorySkills.map(skill => `
                <div class="skill-item">
                  <span class="skill-name">${skill.name}</span>
                  <span class="skill-level">${skill.level}</span>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  // Projects
  if (projects && projects.length > 0) {
    content += `
      <section class="section">
        <h2 class="section-title">Projects</h2>
        ${projects.map(project => `
          <div class="project-item">
            <div class="item-header">
              <div class="item-title">${project.name}</div>
              ${project.startDate && project.endDate ? `
                <div class="item-date">${project.startDate} - ${project.endDate}</div>
              ` : ''}
            </div>
            <div class="item-description">${project.description}</div>
            ${project.technologies && project.technologies.length > 0 ? `
              <div class="technologies">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </section>
    `;
  }

  // Languages
  if (languages && languages.length > 0) {
    content += `
      <section class="section">
        <h2 class="section-title">Languages</h2>
        <div class="skills-grid">
          ${languages.map(lang => `
            <div class="skill-item">
              <span class="skill-name">${lang.name}</span>
              <span class="skill-level">${lang.proficiency}</span>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  // Certifications
  if (certifications && certifications.length > 0) {
    content += `
      <section class="section">
        <h2 class="section-title">Certifications</h2>
        ${certifications.map(cert => `
          <div class="experience-item">
            <div class="item-header">
              <div>
                <div class="item-title">${cert.name}</div>
                <div class="item-subtitle">${cert.issuer}</div>
              </div>
              <div class="item-date">${cert.date}</div>
            </div>
          </div>
        `).join('')}
      </section>
    `;
  }

  return content;
}
