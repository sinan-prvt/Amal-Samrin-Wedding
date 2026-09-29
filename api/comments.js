import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch the top 50 comments
      const comments = await kv.lrange('wedding_comments', 0, 50);
      res.status(200).json(comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  } else if (req.method === 'POST') {
    try {
      const comment = req.body;
      
      // Ensure the comment has required fields
      if (!comment.name || !comment.text) {
        return res.status(400).json({ error: 'Name and text are required' });
      }

      // Add to beginning of the list
      await kv.lpush('wedding_comments', comment);
      res.status(200).json({ success: true, comment });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Failed to add comment' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
