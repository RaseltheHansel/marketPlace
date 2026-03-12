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
    return () =>{ offMessage() };
  },  [listingId, sellerId, roomId, joinRoom, onMessage, offMessage]);

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
    <div className='border border-gray-200 rounded-xl p-4'>
      <h3 className='font-semibold text-gray-800 mb-3 text-sm'>Chat with Seller</h3>
      <div className='h-48 overflow-y-auto space-y-2 mb-3 pr-1'>
        {messages.length === 0 && (
          <p className='text-xs text-gray-400 text-center py-4'>No messages yet. Say hi!</p>
        )}
        {messages.map(m => (
          <div key={m._id}
            className={`flex ${m.sender._id === userId ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-3 py-2 rounded-xl text-sm max-w-xs
              ${m.sender._id === userId
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'}`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} className='flex gap-2'>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder='Type a message...'
          className='flex-1 border border-gray-300 p-2 rounded-lg text-sm outline-none focus:border-blue-500'
        />
        <button type='submit'
          className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700'>
          Send
        </button>
      </form>
    </div>
  );
}