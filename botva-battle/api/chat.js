module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { model, messages, system } = req.body;
  try {
    if (model === "cohere") {
      const COHERE_KEY = process.env.COHERE_API_KEY;
      const history = messages.slice(0, -1).map((m) => ({
        role: m.role === "assistant" ? "CHATBOT" : "USER",
        message: m.content,
      }));
      const lastMsg = messages[messages.length - 1].content;
      const body = {
        model: "command-r7b-12-2024",
        preamble: system || "",
        chat_history: history,
        message: lastMsg,
        max_tokens: 300,
        temperature: 0.9,
      };
      const r = await fetch("https://api.cohere.com/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${COHERE_KEY}` },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "Cohere error");
      return res.status(200).json({ text: data.text || "" });
    }
    if (model === "groq") {
      const GROQ_KEY = process.env.GROQ_API_KEY;
      const body = {
        model: "llama-3.3-70b-versatile",
        messages: [...(system ? [{ role: "system", content: system }] : []), ...messages],
        max_tokens: 300,
        temperature: 0.9,
      };
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_KEY}` },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error?.message || "Groq error");
      return res.status(200).json({ text: data.choices?.[0]?.message?.content || "" });
    }
    if (model === "arbiter") {
      const GROQ_KEY = process.env.GROQ_API_KEY;
      const body = {
        model: "mixtral-8x7b-32768",
        messages: [...(system ? [{ role: "system", content: system }] : []), ...messages],
        max_tokens: 600,
        temperature: 0.3,
      };
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${GROQ_KEY}` },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error?.message || "Groq arbiter error");
      return res.status(200).json({ text: data.choices?.[0]?.message?.content || "" });
    }
    return res.status(400).json({ error: "Unknown model" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
