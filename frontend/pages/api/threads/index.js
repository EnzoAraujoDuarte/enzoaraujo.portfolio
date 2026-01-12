import { BACKEND_URL } from '../../../lib/config';

export default async function handler(req, res) {
  const backendUrl = BACKEND_URL;

  if (req.method === 'POST') {
    try {
      const response = await fetch(`${backendUrl}/threads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const error = await response.text();
        return res.status(response.status).json({ error });
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create thread' });
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
