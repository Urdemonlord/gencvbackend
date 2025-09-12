// API specific types
import { CVData, CVTemplate, PDFGenerationOptions } from './index';

export interface PDFGenerationRequest {
  cvData: CVData;
  template: CVTemplate;
  options?: Partial<PDFGenerationOptions>;
}

export interface PDFGenerationResponse {
  buffer: Buffer;
  filename: string;
  isText: boolean;
}

export interface DOCXGenerationRequest {
  cvData: CVData;
  template: CVTemplate;
}

export interface DOCXGenerationResponse {
  buffer: Buffer;
  filename: string;
}

// Re-export main types for convenience
export type { CVData, CVTemplate, PDFGenerationOptions } from './index';
