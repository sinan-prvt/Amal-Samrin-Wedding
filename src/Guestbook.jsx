import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Guestbook = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch comments from Vercel Serverless Function
    const fetchComments = async () => {
      try {
        const response = await fetch('/api/comments');
        if (response.ok) {
          const text = await response.text();
          try {
            const data = JSON.parse(text);
            if (Array.isArray(data) && data.length > 0) {
              setComments(data);
              return;
            }
          } catch (e) {
            console.warn('Running locally (API not executed). Falling back to mock comments.');
          }
        }
      } catch (error) {
        console.error('Failed to load comments:', error);
      }
      
      // Fallback for local development or empty DB
      setComments([
        { id: 1, name: 'Aisha', text: 'Wishing you both a lifetime of love and happiness!', date: 'Just now' },
        { id: 2, name: 'Rahul & Family', text: 'Cannot wait to celebrate this beautiful day with you.', date: '1 hr ago' }
      ]);
    };
    
    fetchComments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newComment = {
      id: Date.now(),
      name: name.trim(),
      text: message.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    // Optimistically update the UI
    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    setName('');
    setMessage('');

    // Save to Vercel KV Database
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });
    } catch (error) {
      console.error('Failed to save comment:', error);
    }
  };

  const handleLike = async (id) => {
    // Optimistically update
    setComments(prev => prev.map(c => {
      if (c.id === id && !c.hasLiked) {
        return { ...c, likes: (c.likes || 0) + 1, hasLiked: true };
      }
      return c;
    }));

    try {
      await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="invite-section" style={{ position: 'relative', overflow: 'hidden', padding: '60px 20px', backgroundColor: '#F8F6F0' }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '600px', margin: '0 auto', zIndex: 10, position: 'relative' }}
      >
        <motion.div variants={fadeUpVariant} className="subtitle" style={{ letterSpacing: '4px', marginBottom: '10px' }}>Wishes & Blessings</motion.div>
        <motion.h2 variants={fadeUpVariant} className="section-title" style={{ marginBottom: '40px', fontSize: '3rem' }}>Guestbook</motion.h2>

        <motion.div variants={fadeUpVariant} style={{ width: '100%', backgroundColor: '#fff', borderRadius: '25px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid rgba(130, 138, 80, 0.1)', marginBottom: '40px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input 
              type="text" 
              placeholder="Your Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ padding: '15px 20px', borderRadius: '15px', border: '1px solid #E0E0E0', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', outline: 'none', backgroundColor: '#FDFCF9' }}
              required
            />
            <textarea 
              placeholder="Leave a message for the couple..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              style={{ padding: '15px 20px', borderRadius: '15px', border: '1px solid #E0E0E0', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', outline: 'none', backgroundColor: '#FDFCF9', resize: 'vertical' }}
              required
            ></textarea>
            <button type="submit" style={{ padding: '15px 30px', backgroundColor: 'var(--color-green-olive)', color: '#fff', border: 'none', borderRadius: '30px', fontFamily: 'var(--font-serif)', fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', transition: 'background-color 0.3s ease' }}>
              Send Wishes
            </button>
          </form>
        </motion.div>

        <motion.div variants={fadeUpVariant} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px', paddingBottom: '20px' }}>
          {comments.map((comment) => (
            <div key={comment.id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{comment.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <button 
                    onClick={() => handleLike(comment.id)}
                    style={{ background: 'none', border: 'none', cursor: comment.hasLiked ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: (comment.likes > 0 || comment.hasLiked) ? 'var(--color-red-dahlia)' : '#999', padding: 0, transition: 'all 0.2s ease' }}
                  >
                    <Heart size={14} fill={(comment.likes > 0 || comment.hasLiked) ? 'var(--color-red-dahlia)' : 'none'} strokeWidth={2.5} />
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>{comment.likes || 0}</span>
                  </button>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.7rem', color: '#999' }}>{comment.date}</div>
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                {comment.text}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Guestbook;
