import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createJob = async (req: Request, res: Response) => {
    try {
        const { title, total_points, strictness, grade_level, assignment_instructions_text, rubric_source, rubric_text } = req.body;
        // For MVP, hardcode a user ID since we don't have auth yet.
        // In a real app, this comes from req.user
        let user = await prisma.user.findFirst();
        if (!user) {
            user = await prisma.user.create({
                data: { email: 'demo@teacher.com' }
            });
        }

        const job = await prisma.gradingJob.create({
            data: {
                user_id: user.id,
                title,
                total_points: Number(total_points),
                strictness: strictness || 'NORMAL',
                grade_level: grade_level || '6',
                assignment_instructions_text,
                rubric_source: rubric_source || 'GENERATED',
                rubric_text,
                status: 'DRAFT'
            }
        });

        res.json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create job' });
    }
};

export const getJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await prisma.gradingJob.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                _count: {
                    select: { submissions: true }
                }
            }
        });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};

export const getJobById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const job = await prisma.gradingJob.findUnique({
            where: { id },
            include: {
                submissions: {
                    include: { grade_result: true }
                }
            }
        });
        if (!job) return res.status(404).json({ error: 'Job not found' });
        res.json(job);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch job' });
    }
};

export const deleteJob = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // First delete all grade results for this job's submissions
        await prisma.gradeResult.deleteMany({
            where: {
                submission: {
                    job_id: id
                }
            }
        });

        // Then delete all submissions for this job
        await prisma.submission.deleteMany({
            where: { job_id: id }
        });

        // Finally delete the job
        await prisma.gradingJob.delete({
            where: { id }
        });

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete job' });
    }
};
