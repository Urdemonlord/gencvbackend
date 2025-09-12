import { CVData, CVScore } from '@gencv/types';

// Calculate CV completeness score
export function calculateCVScore(cvData: CVData): CVScore {
  let totalScore = 0;
  const maxScore = 100;
  const suggestions: string[] = [];

  const breakdown = {
    personalInfo: 0,
    professionalSummary: 0,
    experience: 0,
    education: 0,
    skills: 0,
    projects: 0,
  };

  // Personal Info (20 points)
  if (cvData.personalInfo) {
    let personalScore = 0;
    if (cvData.personalInfo.fullName) personalScore += 5;
    if (cvData.personalInfo.email) personalScore += 5;
    if (cvData.personalInfo.phone) personalScore += 3;
    if (cvData.personalInfo.location) personalScore += 3;
    if (cvData.personalInfo.linkedinUrl) personalScore += 2;
    if (cvData.personalInfo.githubUrl) personalScore += 2;
    
    breakdown.personalInfo = Math.min(personalScore, 20);
    totalScore += breakdown.personalInfo;
    
    if (!cvData.personalInfo.fullName) suggestions.push("Add your full name");
    if (!cvData.personalInfo.email) suggestions.push("Add your email address");
    if (!cvData.personalInfo.phone) suggestions.push("Add your phone number");
    if (!cvData.personalInfo.linkedinUrl) suggestions.push("Consider adding your LinkedIn profile");
  } else {
    suggestions.push("Add personal information section");
  }

  // Professional Summary (15 points)
  if (cvData.professionalSummary && cvData.professionalSummary.trim().length > 50) {
    breakdown.professionalSummary = 15;
    totalScore += 15;
  } else if (cvData.professionalSummary) {
    breakdown.professionalSummary = 8;
    totalScore += 8;
    suggestions.push("Expand your professional summary (aim for 2-3 sentences)");
  } else {
    suggestions.push("Add a professional summary to highlight your key qualifications");
  }

  // Experience (25 points)
  if (cvData.experience && cvData.experience.length > 0) {
    let expScore = cvData.experience.length * 8;
    
    // Bonus points for detailed experiences
    cvData.experience.forEach(exp => {
      if (exp.achievements && exp.achievements.length > 0) expScore += 3;
      if (exp.description && exp.description.length > 100) expScore += 2;
    });
    
    breakdown.experience = Math.min(expScore, 25);
    totalScore += breakdown.experience;
    
    if (cvData.experience.length === 1) {
      suggestions.push("Consider adding more work experiences if available");
    }
  } else {
    suggestions.push("Add your work experience");
  }

  // Education (15 points)
  if (cvData.education && cvData.education.length > 0) {
    breakdown.education = Math.min(cvData.education.length * 10, 15);
    totalScore += breakdown.education;
  } else {
    suggestions.push("Add your education background");
  }

  // Skills (15 points)
  if (cvData.skills && cvData.skills.length > 0) {
    breakdown.skills = Math.min(cvData.skills.length * 2, 15);
    totalScore += breakdown.skills;
    
    if (cvData.skills.length < 5) {
      suggestions.push("Add more relevant skills (aim for 5-10)");
    }
  } else {
    suggestions.push("Add your technical and soft skills");
  }

  // Projects (10 points)
  if (cvData.projects && cvData.projects.length > 0) {
    let projectScore = cvData.projects.length * 4;
    
    // Bonus for detailed projects
    cvData.projects.forEach(project => {
      if (project.technologies && project.technologies.length > 0) projectScore += 2;
      if (project.url || project.githubUrl) projectScore += 1;
    });
    
    breakdown.projects = Math.min(projectScore, 10);
    totalScore += breakdown.projects;
  } else {
    suggestions.push("Add some projects to showcase your work");
  }

  // Ensure total doesn't exceed maximum
  totalScore = Math.min(totalScore, maxScore);

  return {
    total: Math.round(totalScore),
    breakdown,
    suggestions,
  };
}

// Get completion percentage
export function getCompletionPercentage(cvData: CVData): number {
  const score = calculateCVScore(cvData);
  return score.total;
}

// Check if CV meets minimum requirements for PDF generation
export function isReadyForDownload(cvData: CVData): boolean {
  const score = calculateCVScore(cvData);
  return score.total >= 60; // Minimum 60% completion
}
