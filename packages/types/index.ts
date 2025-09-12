// Personal Information Types
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
}

// Education Types
export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

// Work Experience Types
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  achievements: string[];
  isCurrent: boolean;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
  startDate?: string;
  endDate?: string;
}

// Skill Types
export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft' | 'Language' | 'Other';
}

// Main CV Data Interface
export interface CVData {
  personalInfo?: PersonalInfo;
  professionalSummary?: string;
  education?: Education[];
  experience?: WorkExperience[];
  projects?: Project[];
  skills?: Skill[];
  languages?: Array<{
    id: string;
    name: string;
    proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  customSections?: Array<{
    id: string;
    title: string;
    content: string;
  }>;
}

// Template Types
export type CVTemplate = 'modern' | 'classic' | 'creative' | 'minimal';

// PDF Generation Types
export interface PDFGenerationOptions {
  template: CVTemplate;
  format: 'A4' | 'Letter';
  margin: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
  printBackground: boolean;
  preferCSSPageSize: boolean;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// AI Enhancement Types
export interface AIEnhancementRequest {
  text: string;
  type: 'summary' | 'experience' | 'skills' | 'project' | 'general';
  context?: {
    role?: string;
    company?: string;
    experienceLevel?: string;
    industry?: string;
  };
}

export interface AIEnhancementResponse {
  enhancedText: string;
  suggestions?: string[];
}

// Form Validation Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isValid: boolean;
  errors: ValidationError[];
  isSubmitting: boolean;
}

// CV Completeness Score
export interface CVScore {
  total: number;
  breakdown: {
    personalInfo: number;
    professionalSummary: number;
    experience: number;
    education: number;
    skills: number;
    projects: number;
  };
  suggestions: string[];
}

// Export all types
export * from './api';
export * from './form';
