import React from 'react';

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          GenCV - AI-Powered CV Generator
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create professional resumes with AI-powered content enhancement. 
          Modern, beautiful, and ATS-friendly CV templates powered by Puppeteer.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">AI-Powered Enhancement</h3>
            <p className="text-muted-foreground">
              Intelligent content rewriting and suggestions using Google Gemini AI
            </p>
          </div>
          
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">High-Quality PDF</h3>
            <p className="text-muted-foreground">
              Puppeteer-powered PDF generation with ATS-friendly, selectable text
            </p>
          </div>
          
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Modern Templates</h3>
            <p className="text-muted-foreground">
              Beautiful, professional templates optimized for modern hiring practices
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            Backend ready for integration with Next.js monorepo architecture
          </p>
        </div>
      </div>
    </main>
  );
}
