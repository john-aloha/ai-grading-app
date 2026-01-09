# AI Grading App - Task Description

## Overview

Build a full-stack AI-powered grading application that allows educators to upload student submissions, define grading rubrics, and receive automated, fair, and consistent grades using GPT-5.2.

## Problem Statement

Teachers and educators spend significant time grading student assignments manually. This process is:
- Time-consuming
- Prone to inconsistency
- Exhausting during large batches

The AI Grading App automates this process while maintaining quality and consistency.

## Core Features

### 1. Job Management
- Create grading "jobs" with assignment details
- Set total points, strictness levels (Lenient, Normal, Strict)
- Provide assignment instructions
- Option to supply custom rubric or let AI generate one

### 2. Submission Upload
- Upload individual submissions (PDF, DOCX, TXT)
- Batch upload via ZIP file containing multiple submissions
- Automatic text extraction from various file formats

### 3. AI-Powered Grading
- Integration with OpenAI GPT-5.2 for intelligent grading
- Configurable strictness affects AI temperature
- Detailed feedback and rubric breakdown per submission

### 4. Results Dashboard
- View all grading jobs
- Track submission status (Pending, Grading, Graded, Error)
- View detailed grades, feedback, and breakdown per student

## Technical Requirements

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19 with Framer Motion animations
- **Styling**: TailwindCSS with custom design system
- **Components**: Radix UI primitives with shadcn/ui styling

### Backend
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **File Parsing**: pdf-parse, mammoth (DOCX), adm-zip
- **AI Integration**: OpenAI SDK

### Architecture
- RESTful API design
- Background job processing with worker queue
- File upload handling with Multer

## User Flow

1. **Create Job** → Define assignment title, points, strictness, instructions, and optional rubric
2. **Upload Submissions** → Single files or batch ZIP upload
3. **Start Grading** → Trigger AI processing for all pending submissions
4. **Review Results** → View grades, feedback, and export results

## Success Criteria

- [ ] Users can create and manage grading jobs
- [ ] System supports multiple file formats (PDF, DOCX, TXT, ZIP)
- [ ] AI grades submissions accurately based on rubric
- [ ] UI is responsive and visually appealing
- [ ] Error handling is robust and informative
