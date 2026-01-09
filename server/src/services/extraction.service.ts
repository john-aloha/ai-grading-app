import fs from 'fs';
import path from 'path';
const pdf = require('pdf-parse');
import mammoth from 'mammoth';

export const extractText = async (filePath: string): Promise<string> => {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    const ext = path.extname(filePath).toLowerCase();

    try {
        if (ext === '.pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } else if (ext === '.docx') {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } else if (ext === '.txt') {
            return fs.readFileSync(filePath, 'utf-8');
        } else {
            // Fallback for others, try reading as text
            return fs.readFileSync(filePath, 'utf-8');
        }
    } catch (error) {
        console.error(`Extraction failed for ${filePath}:`, error);
        throw error;
    }
};
