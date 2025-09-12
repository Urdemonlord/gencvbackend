import { CVData, ValidationError } from '@gencv/types';

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation
export function validatePhone(phone: string): boolean {
  // Basic phone validation (international format)
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// URL validation
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Date validation
export function validateDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

// Validate personal information
export function validatePersonalInfo(personalInfo: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!personalInfo) {
    errors.push({ field: 'personalInfo', message: 'Personal information is required' });
    return errors;
  }

  if (!personalInfo.fullName || personalInfo.fullName.trim().length < 2) {
    errors.push({ field: 'fullName', message: 'Full name is required and must be at least 2 characters' });
  }

  if (!personalInfo.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(personalInfo.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (personalInfo.phone && !validatePhone(personalInfo.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }

  if (personalInfo.linkedinUrl && !validateUrl(personalInfo.linkedinUrl)) {
    errors.push({ field: 'linkedinUrl', message: 'Please enter a valid LinkedIn URL' });
  }

  if (personalInfo.githubUrl && !validateUrl(personalInfo.githubUrl)) {
    errors.push({ field: 'githubUrl', message: 'Please enter a valid GitHub URL' });
  }

  if (personalInfo.websiteUrl && !validateUrl(personalInfo.websiteUrl)) {
    errors.push({ field: 'websiteUrl', message: 'Please enter a valid website URL' });
  }

  return errors;
}

// Validate work experience
export function validateExperience(experience: any[]): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!experience || experience.length === 0) {
    return errors; // Experience is optional
  }

  experience.forEach((exp, index) => {
    const prefix = `experience.${index}`;

    if (!exp.company || exp.company.trim().length < 2) {
      errors.push({ field: `${prefix}.company`, message: 'Company name is required' });
    }

    if (!exp.position || exp.position.trim().length < 2) {
      errors.push({ field: `${prefix}.position`, message: 'Position title is required' });
    }

    if (!exp.startDate || !validateDate(exp.startDate)) {
      errors.push({ field: `${prefix}.startDate`, message: 'Valid start date is required' });
    }

    if (!exp.isCurrent && (!exp.endDate || !validateDate(exp.endDate))) {
      errors.push({ field: `${prefix}.endDate`, message: 'Valid end date is required for past positions' });
    }

    if (exp.startDate && exp.endDate && new Date(exp.startDate) > new Date(exp.endDate)) {
      errors.push({ field: `${prefix}.endDate`, message: 'End date must be after start date' });
    }

    if (!exp.description || exp.description.trim().length < 10) {
      errors.push({ field: `${prefix}.description`, message: 'Job description must be at least 10 characters' });
    }
  });

  return errors;
}

// Validate education
export function validateEducation(education: any[]): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!education || education.length === 0) {
    return errors; // Education is optional
  }

  education.forEach((edu, index) => {
    const prefix = `education.${index}`;

    if (!edu.institution || edu.institution.trim().length < 2) {
      errors.push({ field: `${prefix}.institution`, message: 'Institution name is required' });
    }

    if (!edu.degree || edu.degree.trim().length < 2) {
      errors.push({ field: `${prefix}.degree`, message: 'Degree is required' });
    }

    if (!edu.fieldOfStudy || edu.fieldOfStudy.trim().length < 2) {
      errors.push({ field: `${prefix}.fieldOfStudy`, message: 'Field of study is required' });
    }

    if (!edu.startDate || !validateDate(edu.startDate)) {
      errors.push({ field: `${prefix}.startDate`, message: 'Valid start date is required' });
    }

    if (!edu.endDate || !validateDate(edu.endDate)) {
      errors.push({ field: `${prefix}.endDate`, message: 'Valid end date is required' });
    }

    if (edu.startDate && edu.endDate && new Date(edu.startDate) > new Date(edu.endDate)) {
      errors.push({ field: `${prefix}.endDate`, message: 'End date must be after start date' });
    }
  });

  return errors;
}

// Validate skills
export function validateSkills(skills: any[]): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!skills || skills.length === 0) {
    return errors; // Skills are optional
  }

  const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const validCategories = ['Technical', 'Soft', 'Language', 'Other'];

  skills.forEach((skill, index) => {
    const prefix = `skills.${index}`;

    if (!skill.name || skill.name.trim().length < 2) {
      errors.push({ field: `${prefix}.name`, message: 'Skill name is required' });
    }

    if (!skill.level || !validLevels.includes(skill.level)) {
      errors.push({ field: `${prefix}.level`, message: 'Valid skill level is required' });
    }

    if (!skill.category || !validCategories.includes(skill.category)) {
      errors.push({ field: `${prefix}.category`, message: 'Valid skill category is required' });
    }
  });

  return errors;
}

// Validate projects
export function validateProjects(projects: any[]): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!projects || projects.length === 0) {
    return errors; // Projects are optional
  }

  projects.forEach((project, index) => {
    const prefix = `projects.${index}`;

    if (!project.name || project.name.trim().length < 2) {
      errors.push({ field: `${prefix}.name`, message: 'Project name is required' });
    }

    if (!project.description || project.description.trim().length < 10) {
      errors.push({ field: `${prefix}.description`, message: 'Project description must be at least 10 characters' });
    }

    if (project.url && !validateUrl(project.url)) {
      errors.push({ field: `${prefix}.url`, message: 'Please enter a valid project URL' });
    }

    if (project.githubUrl && !validateUrl(project.githubUrl)) {
      errors.push({ field: `${prefix}.githubUrl`, message: 'Please enter a valid GitHub URL' });
    }
  });

  return errors;
}

// Validate entire CV data
export function validateCVData(cvData: CVData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate personal info (required)
  errors.push(...validatePersonalInfo(cvData.personalInfo));

  // Validate optional sections
  if (cvData.experience) {
    errors.push(...validateExperience(cvData.experience));
  }

  if (cvData.education) {
    errors.push(...validateEducation(cvData.education));
  }

  if (cvData.skills) {
    errors.push(...validateSkills(cvData.skills));
  }

  if (cvData.projects) {
    errors.push(...validateProjects(cvData.projects));
  }

  return errors;
}

// Check if CV data is valid for PDF generation
export function isValidForPDFGeneration(cvData: CVData): boolean {
  const errors = validateCVData(cvData);
  return errors.length === 0 && 
         Boolean(cvData.personalInfo?.fullName) && 
         Boolean(cvData.personalInfo?.email);
}
