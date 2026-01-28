"use client";

import { useState, useEffect } from "react";
import { askGemini, getChatHistory } from "./server";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSubmit = async () => {
    setLoading(true);

    // send new question + old chat to server
    const answer = await askGemini(input);

    setResponse(answer);

    // save conversation in browser memory
    setHistory(prev =>
      prev.concat({ question: input, answer: answer })
    );

    setLoading(false);
  };

  useEffect(() => {
    async function loadHistory() {
      const data = await getChatHistory();
  
      // Convert DB format → your UI format
      const formatted = data.reduce((acc, item, index) => {
        if (item.role === "user") {
          acc.push({ question: item.text, answer: "" });
        } else if (item.role === "model") {
          acc[acc.length - 1].answer = item.text;
        }
        return acc;
      }, []);
  
      setHistory(formatted);
    }
  
    loadHistory();
  }, []);
  

  return (
    <div style={{ padding: "50px" }}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask AI..."
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>

      <p>{response}</p>

      <ul>
        {history.map((item, i) => (
          <li key={i}>
            <b>You:</b> {item.question}<br />
            <b>AI:</b> {item.answer}
          </li>
        ))}
      </ul>
    </div>
  );
}
