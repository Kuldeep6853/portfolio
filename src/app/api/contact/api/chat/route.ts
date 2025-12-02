import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { query } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const knowledgeBase = `
    My name is Alpha.
    I am a Developer.
    I have built projects using React, Next.js, Node.js, and AI.
    Major Projects:
    - Weather App (React + Chart.js)
    - AI Chatbot Agent (Python + LangChain)
    - Portfolio Website (Next.js + Tailwind)
    Skills: React, Next.js, Tailwind, Node.js, Supabase, AI Models.
    `;

    const prompt = `
    You are an assistant for my portfolio. 

    Only answer using information below:

    ${knowledgeBase}

    If the question is not related, say:
    "I can only answer questions about Alpha or his portfolio."

    User asked:
    "${query}"
    `;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    return Response.json({ answer: text });
  } catch (err) {
    console.error("API Error:", err);
    return Response.json({ answer: "Something went wrong..." });
  }
}
