import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { messages } = await req.json();

  if (!messages || !Array.isArray(messages)) {
    return new Response('Invalid messages format', { status: 400 });
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messages, // <-- Aqui garantimos que TODO o histórico é enviado!
    stream: true,
  });

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });
}
