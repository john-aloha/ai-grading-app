import fs from 'fs';
import path from 'path';
const pdf = require('pdf-parse');
import mammoth from 'mammoth';

// Common patterns for student name extraction
const NAME_PATTERNS = [
    /^Name:\s*(.+?)$/mi,
    /^Student Name:\s*(.+?)$/mi,
    /^Student:\s*(.+?)$/mi,
    /^Author:\s*(.+?)$/mi,
    /^By:\s*(.+?)$/mi,
    /^Submitted by:\s*(.+?)$/mi,
    /^Written by:\s*(.+?)$/mi,
];

export const extractStudentName = (text: string): string | null => {
    // Only search in the first 1000 characters (header area)
    const headerText = text.slice(0, 1000);

    for (const pattern of NAME_PATTERNS) {
        const match = headerText.match(pattern);
        if (match && match[1]) {
            const name = match[1].trim();
            // Validate it looks like a name (not too long, no weird characters)
            if (name.length > 1 && name.length < 100 && /^[a-zA-Z\s\-'.]+$/.test(name)) {
                return name;
            }
        }
    }
    return null;
};

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
