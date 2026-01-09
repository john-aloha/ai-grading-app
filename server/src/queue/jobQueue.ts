import { EventEmitter } from 'events';

export type JobType = 'GRADE_SUBMISSION' | 'GENERATE_RUBRIC';

export interface GradingJobData {
    submissionId: string;
    jobId: string;
    strictness: string;
    totalPoints: number;
}

export interface RubricJobData {
    jobId: string;
    instructions: string;
}

export type JobData = GradingJobData | RubricJobData;

export interface Job {
    id: string;
    type: JobType;
    data: JobData;
}

class InMemoryQueue extends EventEmitter {
    private queue: Job[] = [];
    private processing = false;

    add(type: JobType, data: JobData) {
        const job: Job = {
            id: Math.random().toString(36).substring(7),
            type,
            data
        };
        this.queue.push(job);
        console.log(`[Queue] Added job ${job.id} (${type})`);
        this.process();
        return job;
    }

    private async process() {
        if (this.processing || this.queue.length === 0) return;
        this.processing = true;

        const job = this.queue.shift();
        if (job) {
            console.log(`[Queue] Processing job ${job.id}...`);
            try {
                this.emit('process', job);
                // We rely on the event listener to handle the job.
                // Ideally we would await it here for flow control.
            } catch (error) {
                console.error(`[Queue] Job ${job.id} failed`, error);
            }
        }

        this.processing = false;
        // Check for more jobs
        if (this.queue.length > 0) {
            setTimeout(() => this.process(), 100);
        }
    }
}

export const jobQueue = new InMemoryQueue();
