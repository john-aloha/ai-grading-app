import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';

import { jobQueue } from '../queue/jobQueue';

const prisma = new PrismaClient();

const ALLOWED_EXTS = ['.pdf', '.docx', '.txt', '.rtf'];

export const startJobGrading = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.params;
        const job = await prisma.gradingJob.findUnique({ where: { id: jobId } });
        if (!job) return res.status(404).json({ error: 'Job not found' });

        const submissions = await prisma.submission.findMany({
            where: { job_id: jobId, status: { in: ['PENDING', 'FAILED'] } }
        });

        if (submissions.length === 0) {
            return res.json({ message: 'No pending submissions to grade' });
        }

        for (const sub of submissions) {
            jobQueue.add('GRADE_SUBMISSION', {
                submissionId: sub.id,
                jobId: job.id,
                strictness: job.strictness,
                totalPoints: job.total_points
            });
        }

        await prisma.gradingJob.update({ where: { id: jobId }, data: { status: 'PROCESSING' } });

        res.json({ message: `Enqueued ${submissions.length} submissions for grading` });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to start grading' });
    }
};

export const uploadSubmissions = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.params;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        const job = await prisma.gradingJob.findUnique({ where: { id: jobId } });
        if (!job) return res.status(404).json({ error: 'Job not found' });

        const submissionsCreated = [];

        for (const file of files) {
            const ext = path.extname(file.originalname).toLowerCase();

            if (ext === '.zip') {
                // Handle ZIP
                try {
                    const zip = new AdmZip(file.path);
                    const zipEntries = zip.getEntries();
                    const extractPath = path.join(path.dirname(file.path), `extracted_${file.filename}`);

                    if (!fs.existsSync(extractPath)) {
                        fs.mkdirSync(extractPath, { recursive: true });
                    }

                    zip.extractAllTo(extractPath, true);

                    for (const entry of zipEntries) {
                        if (entry.isDirectory) continue;
                        const entryName = entry.entryName; // name inside zip
                        const entryExt = path.extname(entryName).toLowerCase();

                        // Ignore hidden MAC files
                        if (ALLOWED_EXTS.includes(entryExt) && !entryName.includes('__MACOSX') && !entryName.startsWith('.')) {
                            const sub = await prisma.submission.create({
                                data: {
                                    job_id: jobId,
                                    student_name: path.basename(entryName, entryExt).replace(/_/g, ' '), // Normalize name guess
                                    original_filename: entryName,
                                    file_uri: path.join(extractPath, entryName),
                                    status: 'PENDING'
                                }
                            });
                            submissionsCreated.push(sub);
                        }
                    }
                } catch (e) {
                    console.error("ZIP Error", e);
                }

            } else if (ALLOWED_EXTS.includes(ext)) {
                // Normal file
                const sub = await prisma.submission.create({
                    data: {
                        job_id: jobId,
                        student_name: path.basename(file.originalname, ext).replace(/_/g, ' '),
                        original_filename: file.originalname,
                        file_uri: file.path,
                        status: 'PENDING'
                    }
                });
                submissionsCreated.push(sub);
            }
        }

        res.json({ message: `Successfully processed ${submissionsCreated.length} submissions`, submissions: submissionsCreated });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Upload processing failed' });
    }
};

export const getSubmissions = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.params;
        const submissions = await prisma.submission.findMany({
            where: { job_id: jobId },
            include: { grade_result: true },
            orderBy: { student_name: 'asc' }
        });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
};

export const getSubmissionPreview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const submission = await prisma.submission.findUnique({
            where: { id },
            include: { grade_result: true }
        });
        if (!submission) return res.status(404).json({ error: 'Submission not found' });

        // Return extracted text if available, otherwise try to extract it
        let previewText = submission.extracted_text;
        if (!previewText && submission.file_uri) {
            const { extractText } = await import('../services/extraction.service');
            try {
                previewText = await extractText(submission.file_uri);
                // Save for future use
                await prisma.submission.update({
                    where: { id },
                    data: { extracted_text: previewText }
                });
            } catch (e) {
                previewText = 'Unable to extract text from document.';
            }
        }

        res.json({
            id: submission.id,
            student_name: submission.student_name,
            original_filename: submission.original_filename,
            extracted_text: previewText || 'No content available',
            grade_result: submission.grade_result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get submission preview' });
    }
};

export const updateSubmission = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { student_name } = req.body;

        const submission = await prisma.submission.update({
            where: { id },
            data: { student_name },
            include: { grade_result: true }
        });

        res.json(submission);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update submission' });
    }
};
