import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
  });

  const reply = completion.choices[0]?.message?.content.trim() || '';

  return res.status(200).json({ reply });  // <-- GARANTA QUE É JSON
}

