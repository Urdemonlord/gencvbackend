import { NextRequest, NextResponse } from 'next/server';
import { ContentEnhancer } from '@gencv/lib-ai';

export const maxDuration = 60; // 60 seconds timeout
export const runtime = 'nodejs'; // Gunakan runtime nodejs untuk memastikan SDK Google berfungsi dengan benar

export async function POST(request: NextRequest) {
  console.log('AI API request received:', request.method, request.url);
  
  try {
    const data = await request.json();
    console.log('Request body received:', data);
    
    // Initialize AI service
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'AI service is not configured properly' },
        { status: 500 }
      );
    }
    
    const enhancer = new ContentEnhancer(apiKey);
    
    // Process based on request type
    let result;
    
    switch (data.type) {
      case 'summary':
        result = await enhancer.enhanceSummary(data.text, data.context);
        break;
        
      case 'experience':
        result = await enhancer.enhanceExperience(data.text, data.context);
        break;
        
      case 'skills':
        result = await enhancer.suggestSkills(data.context);
        break;
        
      case 'project':
        result = await enhancer.enhanceProject(data.text, data.context);
        break;
        
      default:
        result = await enhancer.enhanceGeneral(data.text);
    }
    
    console.log('AI enhancement successful:', { 
      type: data.type, 
      originalLength: data.text?.length || 0,
      enhancedLength: result.enhancedText.length 
    });

    return NextResponse.json({ 
      enhancedText: result.enhancedText,
      suggestions: result.suggestions
    });
    
  } catch (error) {
    console.error('AI enhancement failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'AI enhancement failed', 
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}
