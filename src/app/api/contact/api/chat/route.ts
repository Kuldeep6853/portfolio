import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in .env");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

    return NextResponse.json({ answer: text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Something went wrong..." }, { status: 500 });
  }
}
