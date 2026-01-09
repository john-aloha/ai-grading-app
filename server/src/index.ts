import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Ensure process.env is populated before this import
import './workers/worker';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
    } catch (error) {
        res.status(500).json({ status: 'error', database: 'disconnected', error: String(error) });
    }
});

import jobRoutes from './routes/job.routes';
import submissionRoutes from './routes/submission.routes';

app.use('/api/jobs', jobRoutes);
app.use('/api/submissions', submissionRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
