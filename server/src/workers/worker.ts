import { jobQueue, Job } from '../queue/jobQueue';
import { PrismaClient } from '@prisma/client';
import { extractText, extractStudentName } from '../services/extraction.service';
import { gradeSubmissionAI } from '../services/ai.service';

const prisma = new PrismaClient();

console.log("[Worker] Initialized and listening for jobs...");

jobQueue.on('process', async (job: Job) => {
    if (job.type === 'GRADE_SUBMISSION') {
        const { submissionId, strictness, totalPoints } = job.data as any;
        console.log(`[Worker] Started grading submission ${submissionId}`);

        try {
            const submission = await prisma.submission.findUnique({
                where: { id: submissionId },
                include: { job: true }
            });

            if (!submission || !submission.file_uri) {
                console.error("Submission not found or file missing");
                return;
            }

            // Update status
            await prisma.submission.update({
                where: { id: submissionId },
                data: { status: 'PROCESSING' }
            });

            // Extract
            let text = submission.extracted_text;
            if (!text) {
                try {
                    text = await extractText(submission.file_uri);
                    // Try to extract student name from document
                    const extractedName = extractStudentName(text);
                    // Save extracted text and update name if found
                    await prisma.submission.update({
                        where: { id: submissionId },
                        data: {
                            extracted_text: text,
                            // Only update name if we found one and current name looks like a filename
                            ...(extractedName && submission.student_name.includes('.') ? { student_name: extractedName } : {})
                        }
                    });
                } catch (extractError) {
                    throw new Error(`Extraction failed: ${extractError}`);
                }
            }

            if (!text || text.trim().length === 0) {
                throw new Error("No text extracted from document");
            }

            // Grade
            const result = await gradeSubmissionAI(
                text,
                submission.job.assignment_instructions_text,
                submission.job.rubric_text || '',
                strictness,
                totalPoints
            );

            // Save Result
            await prisma.gradeResult.create({
                data: {
                    submission_id: submission.id,
                    score: result.score,
                    feedback: result.feedback,
                    rubric_breakdown: result.rubric_breakdown
                }
            });

            // Update Status
            await prisma.submission.update({
                where: { id: submissionId },
                data: { status: 'GRADED' }
            });
            console.log(`[Worker] Successfully graded ${submissionId}`);

            // Check if all submissions for this job are now graded
            const jobSubmissions = await prisma.submission.findMany({
                where: { job_id: submission.job_id }
            });
            const allGraded = jobSubmissions.every(s => s.status === 'GRADED' || s.status === 'FAILED');
            if (allGraded) {
                await prisma.gradingJob.update({
                    where: { id: submission.job_id },
                    data: { status: 'COMPLETED' }
                });
                console.log(`[Worker] Job ${submission.job_id} marked as COMPLETED`);
            }

        } catch (error) {
            console.error(`[Worker] Failed grading ${submissionId}`, error);
            await prisma.submission.update({
                where: { id: submissionId },
                data: { status: 'FAILED', error_message: String(error) }
            });
        }
    }
});
