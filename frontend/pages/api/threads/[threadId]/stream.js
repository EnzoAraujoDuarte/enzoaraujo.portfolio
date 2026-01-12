import { BACKEND_URL } from '../../../../lib/config';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { threadId } = req.query;
  const { content, language = 'pt-BR' } = req.body;
  const backendUrl = BACKEND_URL;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  const payload = {
    input: {
      messages: [
        {
          role: 'system',
          content: JSON.stringify({ type: 'settings', language }),
        },
        {
          role: 'user',
          content,
        },
      ],
    },
    config: {
      configurable: {
        language,
      },
    },
  };

  try {
    const response = await fetch(`${backendUrl}/threads/${threadId}/runs/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    return res.status(500).json({ error: 'Stream failed' });
  }
}
