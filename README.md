# GenCV Backend - AI-Powered CV Generator

Backend sistem GenCV yang dibangun dengan monorepo Next.js dan menggunakan Puppeteer untuk menghasilkan PDF berkualitas tinggi dengan teks yang dapat dipilih dan ramah ATS.

## 🚀 Fitur Utama

- **Monorepo Architecture**: Struktur Turborepo yang scalable dengan shared packages
- **PDF Generation**: Puppeteer-core untuk PDF berkualitas tinggi dengan teks selectable
- **AI Enhancement**: Integrasi Google Gemini untuk peningkatan konten CV
- **ATS Friendly**: Format PDF yang dapat dibaca oleh Applicant Tracking Systems
- **TypeScript**: Type safety di seluruh codebase
- **Security**: Middleware keamanan dan rate limiting
- **Fallback System**: Text fallback jika PDF generation gagal

## 🏗️ Struktur Proyek

```
gencv-backend/
├── apps/
│   └── web/                 # Next.js 14 app dengan API routes
│       ├── app/
│       │   ├── api/         # API endpoints
│       │   │   ├── generate-pdf/  # PDF generation endpoint
│       │   │   └── ai/      # AI enhancement endpoint
│       │   └── actions/     # Server actions
│       └── lib/             # Library utilities
├── packages/
│   ├── types/               # Shared TypeScript interfaces
│   ├── utils/               # Utility functions (HTML generator, validation)
│   ├── lib-ai/              # Google Gemini AI integration
│   └── ui/                  # UI components (untuk future frontend)
└── turbo.json               # Turborepo configuration
```

## 🛠️ Tech Stack

### Core
- **Next.js 14**: App Router dengan API routes
- **TypeScript**: Type-safe development
- **Turborepo**: Monorepo management

### PDF Generation
- **Puppeteer-core**: Browser automation untuk PDF
- **@sparticuz/chromium**: Serverless Chrome untuk deployment

### AI Integration
- **Google Gemini AI**: Content enhancement
- **Rate Limiting**: API protection

### Security
- **Custom Middleware**: Rate limiting dan security headers
- **Input Validation**: Comprehensive validation system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 10+
- Google Gemini API key

### Installation

1. **Clone dan install dependencies**
   ```bash
   cd gencvbackend
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

   Edit `apps/web/.env.local`:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:3000
   GEMINI_API_KEY=your_gemini_api_key_here
   API_SECRET_KEY=your_random_secret_key
   NODE_ENV=development
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   Server akan berjalan di: http://localhost:3000

## 📖 API Endpoints

### PDF Generation
```
POST /api/generate-pdf
Content-Type: application/json

{
  "cvData": {
    "personalInfo": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "location": "New York, NY"
    },
    "professionalSummary": "Experienced developer...",
    "experience": [...],
    "education": [...],
    "skills": [...],
    "projects": [...]
  },
  "template": "modern"
}
```

### AI Content Enhancement
```
POST /api/ai
Content-Type: application/json

{
  "type": "summary|experience|skills|project|general",
  "text": "Content to enhance",
  "context": {
    "role": "Software Developer",
    "experienceLevel": "mid-level",
    "industry": "Technology"
  }
}
```

## 🔧 Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build semua packages
npm run type-check      # Type check
npm run lint           # Lint check

# Individual apps
npm run dev:web        # Start web app saja
```

## 📝 Data Types

### CV Data Structure
```typescript
interface CVData {
  personalInfo?: PersonalInfo;
  professionalSummary?: string;
  experience?: WorkExperience[];
  education?: Education[];
  skills?: Skill[];
  projects?: Project[];
  languages?: Language[];
  certifications?: Certification[];
}
```

### Template Options
- `modern`: Modern design dengan gradien
- `classic`: Desain klasik professional
- `creative`: Desain kreatif dengan efek visual
- `minimal`: Desain minimalis bersih

## 🔒 Security Features

- **Rate Limiting**: 20 requests per menit per IP
- **Input Validation**: Validasi komprehensif semua input
- **Security Headers**: X-Frame-Options, XSS Protection, dll
- **API Key Protection**: Optional untuk production
- **CORS Configuration**: Konfigurasi cross-origin yang aman

## 🚀 Deployment ke Vercel

1. **Push code ke GitHub repository**

2. **Connect ke Vercel**
   - Import repository di Vercel
   - Set root directory ke `apps/web`

3. **Environment Variables di Vercel**
   ```
   GEMINI_API_KEY=your_production_gemini_key
   API_SECRET_KEY=your_production_secret
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NODE_ENV=production
   ```

4. **Build Settings**
   - Build Command: `cd ../.. && npm run build --filter=@gencv/web`
   - Output Directory: `apps/web/.next`

## 🧪 Testing PDF Generation

Contoh curl request untuk test PDF generation:

```bash
curl -X POST http://localhost:3000/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "cvData": {
      "personalInfo": {
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      },
      "professionalSummary": "Experienced software developer with 5+ years..."
    },
    "template": "modern"
  }' \
  --output cv.pdf
```

## 🤝 Integration dengan Frontend

Backend ini dirancang untuk berintegrasi dengan frontend React/Next.js. Contoh penggunaan:

```typescript
// Generate PDF
const response = await fetch('/api/generate-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ cvData, template: 'modern' })
});

const blob = await response.blob();
// Download atau preview PDF

// AI Enhancement
const aiResponse = await fetch('/api/ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'summary',
    text: 'Original summary text',
    context: { role: 'Developer', experienceLevel: 'senior' }
  })
});

const { enhancedText } = await aiResponse.json();
```

## 🔧 Troubleshooting

### PDF Generation Issues
1. **Puppeteer fails**: Check Chrome installation atau fallback ke text mode
2. **Memory issues**: Increase Node.js memory limit
3. **Timeout**: Increase `maxDuration` di API route

### AI Enhancement Issues
1. **Invalid API Key**: Check `GEMINI_API_KEY` environment variable
2. **Rate Limits**: Implement exponential backoff
3. **Content Policy**: Ensure content complies dengan Google AI policies

## 📞 Support

Untuk pertanyaan atau masalah:
1. Check dokumentasi ini
2. Review error logs di console
3. Test dengan curl commands
4. Check environment variables

---

**Backend GenCV siap untuk production deployment dengan high-quality PDF generation dan AI-powered content enhancement!** 🎉
