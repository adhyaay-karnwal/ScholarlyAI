import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("API_KEY_HERE");

export async function chatWithGemini(prompt: string, context?: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const fullPrompt = context 
    ? `${context}\n\nUser: ${prompt}`
    : prompt;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}

export const templatePrompts = {
  'general-chat': '',
  'code-assistant': 'You are an expert programming assistant. Help with code, debugging, and best practices.',
  'content-writer': 'You are a professional content writer. Help create engaging and well-structured content.',
  'sql-expert': 'You are an expert SQL developer. Help with database queries, optimization, and best practices.',
  'essay-generator': 'You are an expert essay writer. Create well-structured, engaging essays based on the provided topic and requirements.',
  'math-solver': 'You are a math expert. Provide detailed, step-by-step solutions to mathematical problems.',
  'lesson-planner': 'You are an experienced educator. Create detailed lesson plans with clear objectives, activities, and assessments.',
  'study-guide': 'You are an academic expert. Create comprehensive study guides with key concepts, examples, and practice questions.',
  'text-summarizer': 'You are an expert in content analysis. Provide clear, concise summaries while maintaining key information.',
  'resume-builder': 'You are a professional resume writer. Create tailored, impactful resumes based on the provided information.',
};