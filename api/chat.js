export default async function handler(req, res) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key not configured.' });
    }

    const { messages } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(500).json({ error: 'OpenAI API Error', details: errorData });
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content;

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
