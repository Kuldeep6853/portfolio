"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiMessageRoundedDots } from "react-icons/bi";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  // Initialize Gemini client once
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    try {
      // Try newest model first
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

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
You are a chatbot built for my portfolio website.

Answer ONLY using the information provided below and follow the formatting rules strictly.

### 📌 Formatting Rules:
- Always respond in clean readable Markdown.
- Use titles, spacing, and bullet points when listing items.
-after every point space of next line .
- Do NOT respond in a single line take .
- Use this exact structure when listing projects:

Here are Alpha's major projects: 

• Project Name  
  - Short tech stack description  
  - Short purpose/summary  

### Allowed Knowledge:
${knowledgeBase}

If the user asks something outside this information, reply with:
"I can only answer questions about Alpha or his portfolio."

### User Question:
"${userMessage.text}"
`;

      const result = await model.generateContent(prompt);
      const botText = result.response.text();

      setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
    } catch (error) {
      console.log("⚠️ API ERROR:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ The AI model is unavailable or this model is not allowed for your API key.",
        },
      ]);
    }

    setTyping(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-black text-white shadow-lg px-5 py-4 rounded-full"
      >
        <BiMessageRoundedDots size={20} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="
              fixed bottom-24 right-6 z-50
              w-[350px] h-[440px]
              sm:w-[350px] sm:h-[400px] 
              max-sm:w-[90vw] max-sm:h-[70vh] max-sm:right-3 max-sm:bottom-20
              flex flex-col rounded-xl overflow-hidden
              border border-gray-300 dark:border-gray-700 
              shadow-xl backdrop-blur-md
              bg-white dark:bg-[#1c1c1d]"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-300 dark:border-gray-700 text-lg font-semibold flex justify-between items-center">
              <span className="text-black dark:text-white">AI Chat</span>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white"
              >
                ✖
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scroll">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm shadow 
                  ${
                    m.sender === "user"
                      ? "bg-gray-200 dark:bg-[#2d2d2d] self-end text-black dark:text-white"
                      : "bg-black dark:bg-[#1f1f1f] text-white self-start"
                  }`}
                >
                  {m.text}
                </motion.div>
              ))}
              {typing && (
                <div className="text-gray-400 text-sm animate-pulse">
                  Typing...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-300 dark:border-gray-700 flex gap-2">
              <input
                className="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-black dark:text-white outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-black dark:bg-white text-white dark:text-black px-4 rounded-lg"
              >
                ➤
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
