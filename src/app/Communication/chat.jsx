'use client';
import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/services/api';

const styles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('Guest' + Math.floor(Math.random() * 1000));
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showReaction, setShowReaction] = useState(null);
  const [reactionPosition, setReactionPosition] = useState('top');
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '👏', '🙏', '❤️', '🔥', '✨', '🎉', '💯', '👋', '😊'];
  const reactionEmojis = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

  useEffect(() => {
    api.messages.getAll()
      .then(data => setMessages(data))
      .catch(err => console.error('Error loading history:', err));

    const ws = new WebSocket(api.getWebSocketUrl());
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected');
      setConnected(true);
    };
    
    ws.onclose = () => {
      console.log('Disconnected');
      setConnected(false);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'userCount') {
          setOnlineUsers(data.count);
        } else {
          setMessages(prev => [...prev, data]);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !connected) return;

    try {
      const message = { username, message: inputMessage, timestamp: new Date().toISOString() };
      wsRef.current.send(JSON.stringify(message));
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className='bg-amber-50 rounded-xl relative overflow-hidden'>
      <div className='bg-slate-600 shadow-md p-4 border-b'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold text-gray-50'>Public Chat Room</h1>
          <div className='flex gap-3 items-center'>
            <span className='text-sm text-gray-50'>{onlineUsers} online</span>
            <span className={`px-3 py-1 rounded text-sm ${connected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {connected ? '● Connected' : '● Disconnected'}
            </span>
          </div>
        </div>
        <input
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='mt-2 px-3 py-1 border rounded text-sm'
          placeholder='Your name'
        />
        <p className='text-xs text-gray-50 mt-1'>Anyone can join and chat freely</p>
      </div>

      <div className='h-[calc(100vh-180px)] overflow-y-auto p-4 space-y-3 pb-24 scrollbar-hide' style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}
          >
            <div className='relative group'>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.username === username
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                <p className='text-xs font-semibold mb-1'>{msg.username}</p>
                <p>{msg.message}</p>
                <p className='text-xs opacity-75 mt-1'>
                  {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                </p>
                {msg.reaction && (
                  <span className='absolute -bottom-2 -right-2 bg-white rounded-full px-2 py-1 text-sm shadow'>
                    {msg.reaction}
                  </span>
                )}
              </div>
              <button
                
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setReactionPosition(rect.top < 200 ? 'bottom' : 'top');
                  setShowReaction(showReaction === index ? null : index);
                }}
                className='absolute -top-2 -right-2 bg-gray-200 rounded-full p-1 opacity-0 group-hover:opacity-100 transition'
              >
                😊
              </button>
              {showReaction === index && (
                <div className={`absolute ${msg.username === username ? 'right-0' : 'left-0'} ${reactionPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} bg-white rounded-lg shadow-lg p-2 flex gap-1 z-50`}>
                  {reactionEmojis.map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const updatedMessages = [...messages];
                        updatedMessages[index] = { ...msg, reaction: emoji };
                        setMessages(updatedMessages);
                        setShowReaction(null);
                      }}
                      className='text-xl hover:bg-gray-100 p-1 rounded'
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className='absolute bottom-2 left-0 right-0 bg-slate-700 p-4 border-t shadow-lg rounded-2xl'>
        {showEmoji && (
          <div className='bg-white p-2 rounded-lg mb-2 flex flex-wrap gap-2'>
            {emojis.map((emoji, i) => (
              <button
                key={i}
                type='button'
                onClick={() => setInputMessage(inputMessage + emoji)}
                className='text-2xl hover:bg-gray-100 p-1 rounded'
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        <div className='flex gap-2'>
          <button
            type='button'
            onClick={() => setShowEmoji(!showEmoji)}
            className='px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition text-xl'
          >
            😊
          </button>
          <input
            type='text'
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className='flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Type a message...'
          />
          <button
            type='submit'
            className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'
          >
            Send
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default Chat;