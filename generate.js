// Vercel serverless function. Set OPENAI_API_KEY in project environment variables.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const notes = String(req.body?.notes || "").trim();
  if (!notes) return res.status(400).json({ error: "Notes are required" });
  if (notes.length > 5000) return res.status(413).json({ error: "Please keep notes under 5,000 characters." });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "AI is not configured" });
  try {
    const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "Create 10 to 30 useful study flashcards using ONLY facts supported by the supplied notes. Each card must test one idea, have a clear specific question and concise accurate answer, avoid duplicates and vague questions. If the notes are a short topic phrase rather than source material, create a reasonable introductory deck and do not pretend details came from notes. Return valid JSON only in this shape: {\"cards\":[{\"question\":\"...\",\"answer\":\"...\"}]}. Aim for 10 cards for short input and up to 30 for rich input." },
          { role: "user", content: notes }
        ]
      })
    });
    const payload = await upstream.json();
    if (!upstream.ok) return res.status(502).json({ error: payload.error?.message || "AI request failed" });
    const parsed = JSON.parse(payload.choices?.[0]?.message?.content || "{}");
    const cards = Array.isArray(parsed.cards) ? parsed.cards.slice(0, 30).filter(c => c && typeof c.question === "string" && typeof c.answer === "string" && c.question.trim() && c.answer.trim()) : [];
    if (!cards.length) return res.status(502).json({ error: "The AI returned no valid cards." });
    return res.status(200).json({ cards });
  } catch (error) {
    return res.status(500).json({ error: "Could not generate cards." });
  }
}