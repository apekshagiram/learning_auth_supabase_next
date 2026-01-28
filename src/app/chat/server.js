"use server";

import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/adminC";


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askGemini(userPrompt, history) {
// ✅ Fetch history from DB instead of React state
const { data: dbHistory, error: fetchError } = await supabaseAdmin
  .from("chat_messages")
  .select("role, text");

console.log("📥 FETCH ERROR:", fetchError);



  try {
    const contents = [];

  // ✅ Add DB history to Gemini instead of React history
// ✅ Send only last 15 messages to Gemini
const recentHistory = dbHistory?.slice(-15) || [];

recentHistory.forEach((item) => {
  contents.push({
    role: item.role,
    parts: [{ text: item.text }],
  });
});


    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    const aiText = result.text || "No response text.";

    // ✅ Save user + AI messages in DB
    const { data: insertData, error: insertError } = await supabaseAdmin
  .from("chat_messages")   // ✅ correct table name
  .insert([
    {
      user_id: null,
      role: "user",
      text: userPrompt,
    },
    {
      user_id: null,
      role: "model",
      text: aiText,
    },
  ])
  .select();

console.log("🟢 INSERT DATA:", insertData);
console.log("🔴 INSERT ERROR:", insertError);


    
    return aiText;
    
  } catch (error) {
    console.error("AI Error:", error);
    return `Error: ${error.message}`;
  }
}


export async function getChatHistory() {
  try {
    const { data, error } = await supabaseAdmin
      .from("chat_messages")
      .select("role, text")
      .order("created_at", { ascending: true });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("History Error:", error);
    return [];
  }
}

