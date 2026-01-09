import { Router } from 'express';
import { uploadSubmissions, getSubmissions, startJobGrading } from '../controllers/submission.controller';
import { upload } from '../config/multer';

const router = Router();

router.post('/job/:jobId', upload.array('files'), uploadSubmissions);
router.post('/job/:jobId/start', startJobGrading);
router.get('/job/:jobId', getSubmissions);

export default router;
