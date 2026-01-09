# AI Grading App - Codebase Walkthrough

## Project Structure

```
ai_grading_app/
├── client/                # Next.js Frontend
│   ├── app/               # App Router pages
│   ├── components/        # Reusable UI components
│   ├── lib/               # Utility functions
│   └── public/            # Static assets
├── server/                # Express Backend
│   ├── prisma/            # Database schema & migrations
│   └── src/
│       ├── config/        # Configuration files
│       ├── controllers/   # Route handlers
│       ├── routes/        # API route definitions
│       ├── services/      # Business logic
│       ├── queue/         # Job queue management
│       └── workers/       # Background worker processes
├── README.md              # User & Admin documentation
├── TASK.md               # Task description
├── WALKTHROUGH.md        # This file (codebase guide)
└── IMPLEMENTATION_PLAN.md # Development roadmap
```

---

## Frontend (client/)

### Technology Stack
- **Next.js 16** with App Router
- **React 19** for UI components
- **Framer Motion** for animations
- **TailwindCSS** for styling
- **Radix UI + shadcn/ui** for accessible components

### Key Pages

#### `app/page.tsx` - Landing Page
- Hero section with animated entrance
- Gradient text and call-to-action buttons
- Links to dashboard

#### `app/dashboard/` - Dashboard
- Overview of all grading jobs
- Quick actions for creating new jobs

#### `app/jobs/` - Job Management
- Job creation form
- Job detail view with submissions
- Grading controls and results

### Components (`components/`)
- Reusable UI primitives (buttons, cards, etc.)
- Custom shadcn/ui components configured in `components.json`

---

## Backend (server/)

### Technology Stack
- **Express 5** web framework
- **TypeScript** for type safety
- **Prisma** ORM with SQLite
- **OpenAI SDK** for AI integration
- **Multer** for file uploads

### Entry Point (`src/index.ts`)
```typescript
// Key setup:
- CORS configuration
- JSON body parsing
- Health check endpoint
- Route mounting (/api/jobs, /api/submissions)
- Worker initialization
```

### Database Schema (`prisma/schema.prisma`)

#### Models:
1. **User** - App users (email, password_hash)
2. **GradingJob** - Grading configuration
   - title, total_points, strictness
   - assignment_instructions_text
   - rubric_text (optional)
   - status: DRAFT | PROCESSING | COMPLETED
3. **Submission** - Student submissions
   - student_name, file paths
   - extracted_text from documents
   - status: PENDING | GRADING | GRADED | ERROR
4. **GradeResult** - AI grading output
   - score, feedback, rubric_breakdown

### API Routes

#### Jobs Routes (`routes/job.routes.ts`)
- `POST /api/jobs` - Create new grading job
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

#### Submission Routes (`routes/submission.routes.ts`)
- `POST /api/submissions` - Upload submissions (file or ZIP)
- `GET /api/submissions/:jobId` - Get submissions for job
- `POST /api/submissions/:jobId/grade` - Trigger grading

### Services

#### `services/extraction.service.ts`
Handles text extraction from various file formats:
- **PDF** → pdf-parse library
- **DOCX** → mammoth library
- **TXT** → Native fs read

```typescript
extractText(filePath: string): Promise<string>
```

#### `services/ai.service.ts`
Interfaces with OpenAI GPT-5.2 for grading:
```typescript
gradeSubmissionAI(
  submissionText: string,
  assignmentInstructions: string,
  rubric: string,
  strictness: string,
  totalPoints: number
): Promise<GradingResult>
```

Key features:
- Structured JSON output format
- Temperature varies by strictness level
- Comprehensive prompt engineering

### Worker System (`workers/worker.ts`)
Background processing for:
- Processing uploaded ZIP files
- Running AI grading on queue

---

## Data Flow

### 1. Job Creation
```
Client Form → POST /api/jobs → Create GradingJob in DB
```

### 2. Submission Upload
```
File Upload → Multer → Extract Text → Create Submission in DB
```

### 3. Grading Process
```
Trigger Grade → Worker Queue → AI Service → Store GradeResult
```

### 4. Results Display
```
GET /api/submissions/:jobId → Join with GradeResults → UI Display
```

---

## Environment Variables

### Server (.env)
```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your-api-key"
PORT=3001
```

---

## Development Commands

### Client
```bash
cd client
npm install
npm run dev    # http://localhost:3000
```

### Server
```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run dev    # http://localhost:3001
```

---

## API Health Check
```bash
curl http://localhost:3001/api/health
# Returns: { "status": "ok", "database": "connected", ... }
```
