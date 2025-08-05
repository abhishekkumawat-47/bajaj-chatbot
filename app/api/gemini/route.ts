import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { message } = body;

  const docsDir = path.join(process.cwd(), 'docs');
  const fileNames = fs.readdirSync(docsDir);
  const allowedExts = ['.txt', '.md', '.json'];
  const docs = fileNames
    .filter((file) => allowedExts.includes(path.extname(file).toLowerCase()))
    .map((file) => fs.readFileSync(path.join(docsDir, file), 'utf-8'));

  const context = docs.map((doc: string, i: number) => `Document ${i + 1}:\n${doc}`).join('\n\n');

  const prompt = `
You are a helpful assistant. Based only on the documents below, answer the user's question clearly and concisely.

Documents:
${context}

Instructions:
- Give a strictly short answer (2–3 lines max).
- Use simple, conversational language.
- Don't copy the document word-for-word.
- If unsure, say "I'm not sure based on the provided documents."

User Question: ${message}
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ]
  })
});

    const data = await response.json();
    // console.log('Gemini API response:', JSON.stringify(data));
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm not sure based on the provided documents.";
    return NextResponse.json({ reply: answer });
  } catch (err) {
    console.error('Gemini API error:', err);
    return NextResponse.json({ reply: 'Error contacting Gemini API.' }, { status: 500 });
  }
}
