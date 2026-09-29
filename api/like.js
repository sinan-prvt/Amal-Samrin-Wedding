import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'Comment ID is required' });
      }

      // Fetch current comments
      const comments = await kv.lrange('wedding_comments', 0, 50);
      const index = comments.findIndex(c => c.id === id);

      if (index !== -1) {
        // Increment likes
        const comment = comments[index];
        comment.likes = (comment.likes || 0) + 1;
        
        // Update in Redis
        await kv.lset('wedding_comments', index, comment);
        
        return res.status(200).json({ success: true, likes: comment.likes });
      } else {
        return res.status(404).json({ error: 'Comment not found' });
      }
    } catch (error) {
      console.error('Error liking comment:', error);
      res.status(500).json({ error: 'Failed to like comment' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
