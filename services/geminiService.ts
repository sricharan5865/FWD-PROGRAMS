import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with your API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY || process.env.GEMINI_API_KEY || '');

export const getExamInsights = async (syllabusText: string): Promise<string> => {
  try {
    // Use a valid model name. gemini-1.5-flash is a good default for text analysis.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an experienced academic mentor and study expert. 
      Analyze the following syllabus text and identify the "High Probability" topics that often appear in end-semester exams. 
      Provide actionable advice for a student preparing 2 weeks before exams.
      Format the response using Markdown. 
      Syllabus Content: ${syllabusText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || "Could not generate insights at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error: " + (error as Error).message;
  }
};
