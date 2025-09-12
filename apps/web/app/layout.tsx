import './globals.css';
import { ThemeProvider } from '@/app/providers/theme-provider';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GenCV - AI-Powered CV Generator',
  description: 'Create professional resumes with AI-powered content enhancement. Modern, beautiful, and ATS-friendly CV templates.',
  keywords: 'CV generator, resume builder, AI resume, professional CV, job application',
};

// Viewport export must be separate from metadata in Next.js 14+
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
