import { BACKEND_URL } from '../../../lib/config';

export default async function handler(req, res) {
  const backendUrl = BACKEND_URL;

  if (req.method === 'POST') {
    try {
      if (!backendUrl || backendUrl === 'http://localhost:8001') {
        console.error('BACKEND_URL not configured:', backendUrl);
        return res.status(500).json({ 
          error: 'Backend URL not configured. Please set NEXT_PUBLIC_BACKEND_URL environment variable.' 
        });
      }

      const response = await fetch(`${backendUrl}/threads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', response.status, errorText);
        return res.status(response.status).json({ 
          error: errorText || `Backend returned status ${response.status}` 
        });
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error('Failed to create thread:', error.message);
      return res.status(500).json({ 
        error: `Failed to create thread: ${error.message}` 
      });
    }
  }

  if (req.method === 'GET') {
    try {
      const response = await fetch(`${backendUrl}/threads`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const error = await response.text();
        return res.status(response.status).json({ error });
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to list threads' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
