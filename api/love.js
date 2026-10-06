import { kv } from '@vercel/kv';

const KEY = 'wedding_love_count';
// Taps are batched on the client; cap each request so one visitor can't add a huge number at once.
const MAX_PER_REQUEST = 25;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    try {
      const count = (await kv.get(KEY)) || 0;
      res.status(200).json({ count: Number(count) });
    } catch (error) {
      console.error('Error reading love count:', error);
      res.status(500).json({ error: 'Failed to read love count' });
    }
  } else if (req.method === 'POST') {
    try {
      const requested = Number.parseInt(req.body?.n, 10);
      const n = Math.min(MAX_PER_REQUEST, Math.max(1, Number.isFinite(requested) ? requested : 1));
      const count = await kv.incrby(KEY, n);
      res.status(200).json({ count });
    } catch (error) {
      console.error('Error adding love:', error);
      res.status(500).json({ error: 'Failed to add love' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
