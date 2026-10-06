import { kv } from '@vercel/kv';

const KEY = 'wedding_love_count';

export default async function handler(req, res) {
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
      const count = await kv.incr(KEY);
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
