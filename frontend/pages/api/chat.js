export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, thread_id = 'default', language = 'pt-BR', conversation_history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const rawUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';
    const backendUrl = rawUrl.replace(/\/+$/, ''); // Remove trailing slashes
    
    const response = await fetch(`${backendUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message.trim(),
        thread_id,
        language,
        conversation_history
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Internal server error' }));
      return res.status(response.status).json({ error: errorData.detail || 'Backend error' });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
