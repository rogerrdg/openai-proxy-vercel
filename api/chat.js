import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || '';

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Error fetching completion:', error);
    return res.status(500).json({ error: 'Failed to fetch completion' });
  }
}
