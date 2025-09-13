import { GoogleGenAI } from '@google/genai';
import { AIEnhancementRequest, AIEnhancementResponse } from '@gencv/types';

export class GeminiClient {
  private genAI: GoogleGenAI;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenAI({apiKey});
  }

  async enhanceContent(request: AIEnhancementRequest): Promise<AIEnhancementResponse> {
    try {
      const prompt = this.buildPrompt(request);
      
      const result = await this.genAI.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt
      });
      
      const enhancedText = result.text || '';

      return {
        enhancedText: enhancedText.trim(),
        suggestions: this.extractSuggestions(enhancedText)
      };
    } catch (error) {
      console.error('AI enhancement error:', error);
      throw new Error(`AI enhancement failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildPrompt(request: AIEnhancementRequest): string {
    const { text, type, context } = request;
    
    switch (type) {
      case 'summary':
        return `Create a compelling professional summary for a CV based on this information: "${text}".
        
Guidelines:
- Keep it concise (2-3 sentences max)
- Highlight key skills and experience level
- Include career objectives or passion
- Use active voice and first-person perspective
- Avoid clichés and focus on unique value proposition
- Ensure the tone is confident but not arrogant`;

      case 'experience':
        return `Enhance this job description for a CV, focusing on achievements and impact:
Role: ${context?.role || 'Professional'}
Company: ${context?.company || 'Company'}
Description to enhance: "${text}"

Guidelines:
- Start with strong action verbs
- Quantify achievements where possible (%, numbers, metrics)
- Focus on results and impact, not just responsibilities
- Highlight relevant skills for ${context?.role || 'this position'}
- Keep entries concise and impactful
- Include keywords relevant to the ${context?.industry || 'industry'}`;

      case 'skills':
        return `Suggest 8-10 relevant professional skills for a ${context?.experienceLevel || 'mid-level'} ${context?.role || 'Software Developer'}.

Include:
- Technical skills specific to the role
- Relevant soft skills (2-3)
- Industry-specific knowledge
- Current in-demand technologies or methodologies

Format as a comma-separated list only, without explanations or numbering.`;

      case 'project':
        return `Write a concise, professional project description for a CV with the following details:
Project Name: ${context?.role}
Technologies Used: ${text}
Project Type: ${context?.company || 'Software Project'}

Guidelines:
- 2-3 impactful sentences only
- Start with the project purpose/problem solved
- Mention specific technologies and your role
- Include measurable outcomes or impact
- Focus on unique challenges overcome
- Use first-person perspective and active voice`;

      default:
        return `Enhance this text to be more impactful for a CV: "${text}"

Guidelines:
- Use strong action verbs and professional language
- Be concise but detailed
- Quantify achievements where possible
- Focus on results and impact
- Ensure content is relevant to hiring managers
- Keep the tone confident and professional`;
    }
  }

  private extractSuggestions(enhancedText: string): string[] {
    // Simple extraction of potential suggestions
    const suggestions: string[] = [];
    
    if (enhancedText.includes('consider')) {
      suggestions.push('Consider adding more specific metrics or achievements');
    }
    
    if (enhancedText.includes('quantify')) {
      suggestions.push('Try to quantify your achievements with numbers or percentages');
    }
    
    if (enhancedText.length < 50) {
      suggestions.push('Consider expanding this section with more detail');
    }
    
    return suggestions;
  }

  // Test connection to Gemini API
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.genAI.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: 'Test connection'
      });
      return !!result.text;
    } catch (error) {
      console.error('Gemini API connection test failed:', error);
      return false;
    }
  }
}
