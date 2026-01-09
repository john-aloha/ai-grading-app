import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OpenAI_key || process.env.OPENAI_API_KEY,
});

interface GradingResult {
    score: number;
    feedback: string;
    rubric_breakdown: string;
}

export const gradeSubmissionAI = async (
    submissionText: string,
    assignmentInstructions: string,
    rubric: string,
    strictness: string,
    totalPoints: number
): Promise<GradingResult> => {

    const prompt = `
    You are an expert academic grader. 
    Task: Grade the following student submission.
    
    Configuration:
    - Strictness: ${strictness}
    - Max Points: ${totalPoints}
    
    Assignment Instructions:
    ${assignmentInstructions}
    
    Rubric:
    ${rubric || "Evaluate based on general academic standards appropriate for the instructions."}
    
    Student Submission Text:
    """
    ${submissionText.slice(0, 50000)} 
    """
    
    Provide the output in valid JSON format:
    {
        "score": number (0 to ${totalPoints}),
        "feedback": "detailed constructive feedback for the student",
        "rubric_breakdown": "brief explanation of scoring based on criteria"
    }
    `;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-5.2",
            messages: [
                { role: "system", content: "You are a precise and fair grading assistant. Return only JSON." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: strictness === 'STRICT' ? 0.1 : strictness === 'LENIENT' ? 0.7 : 0.3,
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No response from AI");

        const result = JSON.parse(content);
        return {
            score: Number(result.score),
            feedback: result.feedback,
            rubric_breakdown: result.rubric_breakdown || (typeof result.rubric_breakdown === 'object' ? JSON.stringify(result.rubric_breakdown) : '')
        };
    } catch (error) {
        console.error("AI Grading Error:", error);
        // Fallback or rethrow
        throw error;
    }
};
