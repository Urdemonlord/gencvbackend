import { GeminiClient } from './gemini-client';
import { AIEnhancementRequest, AIEnhancementResponse } from '@gencv/types';

export class ContentEnhancer {
  private geminiClient: GeminiClient;

  constructor(apiKey: string) {
    this.geminiClient = new GeminiClient(apiKey);
  }

  // Enhance professional summary
  async enhanceSummary(text: string, context?: {
    role?: string;
    experienceLevel?: string;
    industry?: string;
  }): Promise<AIEnhancementResponse> {
    const request: AIEnhancementRequest = {
      text,
      type: 'summary',
      context
    };

    return this.geminiClient.enhanceContent(request);
  }

  // Enhance work experience description
  async enhanceExperience(text: string, context?: {
    role?: string;
    company?: string;
    industry?: string;
  }): Promise<AIEnhancementResponse> {
    const request: AIEnhancementRequest = {
      text,
      type: 'experience',
      context
    };

    return this.geminiClient.enhanceContent(request);
  }

  // Generate skill suggestions
  async suggestSkills(context: {
    role: string;
    experienceLevel: string;
    industry?: string;
  }): Promise<AIEnhancementResponse> {
    const request: AIEnhancementRequest = {
      text: '', // Not needed for skill suggestions
      type: 'skills',
      context
    };

    return this.geminiClient.enhanceContent(request);
  }

  // Enhance project description
  async enhanceProject(description: string, context?: {
    name?: string;
    technologies?: string[];
    type?: string;
  }): Promise<AIEnhancementResponse> {
    const request: AIEnhancementRequest = {
      text: description,
      type: 'project',
      context: {
        role: context?.name,
        company: context?.type,
      }
    };

    return this.geminiClient.enhanceContent(request);
  }

  // General content enhancement
  async enhanceGeneral(text: string): Promise<AIEnhancementResponse> {
    const request: AIEnhancementRequest = {
      text,
      type: 'general'
    };

    return this.geminiClient.enhanceContent(request);
  }

  // Test AI service availability
  async testConnection(): Promise<boolean> {
    return this.geminiClient.testConnection();
  }

  // Batch enhance multiple texts
  async batchEnhance(requests: AIEnhancementRequest[]): Promise<AIEnhancementResponse[]> {
    const results: AIEnhancementResponse[] = [];
    
    for (const request of requests) {
      try {
        const result = await this.geminiClient.enhanceContent(request);
        results.push(result);
        
        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        results.push({
          enhancedText: request.text, // Fallback to original text
          suggestions: [`Enhancement failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
        });
      }
    }
    
    return results;
  }
}
