import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { FiSend, FiSearch } from 'react-icons/fi';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const Chat = () => {
  const [friends, setFriends] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [onlineMap, setOnlineMap] = useState({});
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef(null);

  // Connect to Socket.IO on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const s = io(SOCKET_URL, { transports: ['websocket'] });
    setSocket(s);
    s.on('connect', () => {
      s.emit('authenticate', token);
    });
    s.on('newMessage', (msg) => {
      if (selectedUser && (msg.sender._id === selectedUser._id || msg.recipient._id === selectedUser._id)) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    s.on('friendOnline', ({ userId }) => {
      setOnlineMap((prev) => ({ ...prev, [userId]: true }));
    });
    s.on('friendOffline', ({ userId }) => {
      setOnlineMap((prev) => ({ ...prev, [userId]: false }));
    });
    return () => {
      s.disconnect();
    };
  }, [selectedUser]);

  // Fetch friends list on mount
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/friends', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFriends(res.data);
        if (res.data.length > 0) setSelectedUser(res.data[0]);
        // Set initial online map
        const onlineObj = {};
        res.data.forEach(f => { onlineObj[f._id] = f.status === 'online'; });
        setOnlineMap(onlineObj);
      } catch {
        setFriends([]);
      }
    };
    fetchFriends();
  }, []);

  // Fetch messages when selectedUser changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/messages/${selectedUser._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch {
        setMessages([]);
      }
    };
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Format time utility
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Send message handler
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedUser) return;
    try {
      const token = localStorage.getItem('token');
      // Optimistically add message
      const tempMsg = {
        _id: `temp-${Date.now()}`,
        sender: JSON.parse(localStorage.getItem('user')),
        recipient: selectedUser,
        text: input.trim(),
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempMsg]);
      setInput('');
      // Send via API
      const res = await axios.post('/api/messages', {
        recipientId: selectedUser._id,
        text: tempMsg.text,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Replace temp message with real one
      setMessages((prev) => prev.map(m => m._id === tempMsg._id ? res.data : m));
      // Send via Socket.IO
      if (socket) {
        socket.emit('sendMessage', {
          senderId: tempMsg.sender.id || tempMsg.sender._id,
          recipientId: selectedUser._id,
          text: tempMsg.text,
          messageId: res.data._id,
        });
      }
    } catch {
      // Optionally show error or log
    }
  };

  // Filter friends by search
  const filteredFriends = friends.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Sidebar */}
      <aside className="w-1/4 min-w-[250px] bg-white border-r flex flex-col">
        <div className="p-4 border-b font-bold text-lg">Chats</div>
        {/* Search bar */}
        <div className="p-3 border-b flex items-center gap-2 bg-gray-50">
          <FiSearch className="text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search friends..."
            className="w-full bg-transparent outline-none text-gray-700"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <ul className="flex-1 overflow-y-auto">
          {filteredFriends.length === 0 && (
            <li className="p-4 text-gray-400">No friends found</li>
          )}
          {filteredFriends.map((user) => (
            <li
              key={user._id}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-indigo-50 transition ${selectedUser && selectedUser._id === user._id ? 'bg-indigo-100 font-semibold' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              <span className="relative">
                <span className="inline-block w-10 h-10 rounded-full bg-indigo-200 text-indigo-700 text-lg font-bold flex items-center justify-center">
                  {user.avatar || user.name.charAt(0)}
                </span>
                {onlineMap[user._id] && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>}
              </span>
              <span className="flex-1 truncate">{user.name}</span>
            </li>
          ))}
        </ul>
      </aside>
      {/* Chat Area */}
      <main className="flex-1 flex flex-col bg-gradient-to-br from-white to-blue-50">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white flex items-center gap-3 shadow-sm">
          {selectedUser ? (
            <>
              <span className="relative">
                <span className="inline-block w-10 h-10 rounded-full bg-indigo-200 text-indigo-700 text-lg font-bold flex items-center justify-center">
                  {selectedUser.avatar || selectedUser.name.charAt(0)}
                </span>
                {onlineMap[selectedUser._id] && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>}
              </span>
              <span className="font-bold text-lg">{selectedUser.name}</span>
              <span className={`ml-2 text-xs ${onlineMap[selectedUser._id] ? 'text-green-500' : 'text-gray-400'}`}>{onlineMap[selectedUser._id] ? 'Online' : 'Offline'}</span>
            </>
          ) : (
            <span className="text-gray-400">Select a user to start chatting</span>
          )}
        </div>
        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {(!selectedUser || messages.length === 0) && (
            <div className="text-gray-400 text-center mt-10">{selectedUser ? 'No messages yet' : 'Select a user to start chatting'}</div>
          )}
          {messages.map((msg) => {
            const isMe = msg.sender._id !== selectedUser._id;
            return (
              <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-2xl px-4 py-2 max-w-xs md:max-w-md shadow ${isMe ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-900'}`}>
                  <div className="text-xs opacity-70 mb-1">{isMe ? 'You' : msg.sender.name}</div>
                  <div>{msg.text}</div>
                  <div className="text-xs text-right opacity-50 mt-1">{formatTime(msg.createdAt)}</div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        {/* Message Input */}
        <form className="p-4 bg-white border-t flex gap-2 items-center" onSubmit={handleSend}>
          <input
            type="text"
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring text-gray-700 bg-gray-50"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!selectedUser}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSend(e);
              }
            }}
          />
          <button type="submit" className="bg-indigo-500 text-white p-3 rounded-full hover:bg-indigo-600 transition flex items-center justify-center" disabled={!selectedUser}>
            <FiSend className="text-xl" />
          </button>
        </form>
      </main>
    </div>
  );
};

export default Chat; 