import { BACKEND_URL } from '../../../../lib/config';

// Without this the backend sees Vercel's egress IP for every visitor, and
// per-visitor limits silently become limits on the whole site.
function forwardedFor(req) {
  const chain = req.headers['x-forwarded-for'];
  const first = Array.isArray(chain) ? chain[0] : chain;
  return (first || req.socket?.remoteAddress || '').split(',')[0].trim();
}

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
    if (!backendUrl || backendUrl === 'http://localhost:8001') {
      console.error('BACKEND_URL not configured:', backendUrl);
      return res.status(500).json({ 
        error: 'Backend URL not configured. Please set NEXT_PUBLIC_BACKEND_URL environment variable.' 
      });
    }

    const response = await fetch(`${backendUrl}/threads/${threadId}/runs/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': forwardedFor(req) },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend stream error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: errorText || `Backend returned status ${response.status}` 
      });
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
    console.error('Stream failed:', error.message);
    return res.status(500).json({ 
      error: `Stream failed: ${error.message}` 
    });
  }
}
