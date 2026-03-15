import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import api from '../api/axios';
import { useSocket } from '../hooks/useSocket';
import type { Message } from '../types';

interface ChatBoxProps {
  listingId: string;
  sellerId:  string;
  userId:    string;
}

export default function ChatBox({ listingId, sellerId, userId }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text,     setText]     = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { joinRoom, sendMsg, onMessage, offMessage } = useSocket();
  const roomId = [listingId, userId, sellerId].sort().join('_');

  useEffect(() => {
    joinRoom(roomId);
    api.get<Message[]>(`/messages/${listingId}/${sellerId}`)
      .then(r => setMessages(r.data));
    onMessage((msg) => setMessages(prev => [...prev, msg as Message]));
    return () => { offMessage(); };
  }, [listingId, sellerId, roomId, joinRoom, onMessage, offMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const r = await api.post<Message>('/messages', {
      listingId, receiverId: sellerId, text,
    });
    setMessages(prev => [...prev, r.data]);
    sendMsg(roomId, r.data);
    setText('');
  };

  return (
    <div style={{ background: '#251a0e', border: '1px solid #3d2d18', borderRadius: '12px', padding: '16px' }}>
      <p style={{ fontSize: '11px', color: '#c9a87a', marginBottom: '12px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 500 }}>
        Chat with Seller
      </p>

      {/* Messages */}
      <div style={{ height: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', paddingRight: '4px' }}>
        {messages.length === 0 && (
          <p style={{ fontSize: '12px', color: '#8c7055', textAlign: 'center', marginTop: '60px' }}>
            No messages yet. Say hi! 👋
          </p>
        )}
        {messages.map(m => (
          <div key={m._id} style={{ display: 'flex', justifyContent: m.sender._id === userId ? 'flex-end' : 'flex-start' }}>
            <div style={{
              padding: '8px 14px', borderRadius: '12px', fontSize: '13px', maxWidth: '75%',
              background: m.sender._id === userId ? '#e85d26' : '#2e2010',
              color: m.sender._id === userId ? '#fff' : '#c9a87a',
              border: m.sender._id === userId ? 'none' : '1px solid #3d2d18',
            }}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder='Type a message...'
          style={{
            flex: 1,
            background: '#2e2010',
            border: '1px solid #3d2d18',
            color: '#f5ede0',
            padding: '9px 12px',
            borderRadius: '8px',
            fontSize: '13px',
            fontFamily: 'Outfit, sans-serif',
            outline: 'none',
          }}
        />
        <button type='submit'
          style={{
            background: '#e85d26',
            color: '#fff',
            border: 'none',
            padding: '9px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif',
          }}>
          Send
        </button>
      </form>
    </div>
  );
}