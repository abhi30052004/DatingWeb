import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Send, ArrowLeft, MoreVertical, MessageCircle, Smile } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EmojiPicker from 'emoji-picker-react';

export default function Messages() {
  const { matchId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize data and WebSocket
  useEffect(() => {
    if (!matchId) {
      setLoading(false);
      return;
    }

    const fetchInitialMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8000/api/messages/${matchId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed to fetch messages", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialMessages();

    // Initialize WebSocket
    const wsUrl = `ws://localhost:8000/api/messages/ws/${matchId}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      // Ensure we don't duplicate the message if we just sent it (optimistic UI)
      setMessages(prev => {
        if (prev.some(m => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onEmojiClick = (emojiObject: any) => {
    setInput(prev => prev + emojiObject.emoji);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !matchId) return;

    const messageText = input;
    setInput('');
    setShowEmojiPicker(false); // Close picker on send

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/messages/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ match_id: matchId, content: messageText })
      });
      
      if (!res.ok) {
        toast.error("Failed to send message");
        setInput(messageText); // Restore on fail
      }
      // Success is handled by the WebSocket broadcast
    } catch (err) {
      toast.error("Network error");
      setInput(messageText);
    }
  };

  if (!matchId) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400">
        <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
          <MessageCircle size={40} className="text-slate-600" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Your Messages</h2>
        <p>Select a match from the Matches tab to start chatting.</p>
        <button onClick={() => navigate('/matches')} className="mt-6 px-6 py-3 bg-surface border border-slate-700 text-white font-semibold rounded-full hover:border-primary transition">
          View Matches
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background relative">
      {/* Chat Header */}
      <div className="bg-surface/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/matches')} className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-gray-400 hover:text-white transition md:hidden">
            <ArrowLeft size={20} />
          </button>
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary shrink-0">
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-white capitalize">Your Match</h3>
            <p className="text-xs text-green-400 font-medium">Online</p>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-slate-800 text-gray-400 transition">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32" onClick={() => setShowEmojiPicker(false)}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
            <p>You matched!</p>
            <p className="text-sm">Send a message to break the ice 🧊</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender_id === user?._id;
            return (
              <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-surface border border-slate-700 text-gray-200 rounded-bl-none'}`}>
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 w-full bg-surface border-t border-slate-800 p-4 pb-safe z-10">
        
        {/* Conversation Starters */}
        {messages.length === 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">Start with a suggestion</p>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar snap-x pb-1">
              {["What's your favorite travel destination?", "Coffee or tea?", "Best movie you've seen recently?"].map((starter, idx) => (
                <button 
                  key={idx}
                  onClick={() => setInput(starter)}
                  className="snap-start shrink-0 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full px-4 py-2 text-sm text-gray-300 transition whitespace-nowrap"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={sendMessage} className="flex items-center gap-2 relative">
          
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-gray-400 transition shrink-0"
          >
            <Smile size={20} />
          </button>
          
          {showEmojiPicker && (
            <div className="absolute bottom-16 left-0 z-50 shadow-2xl">
              <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
            </div>
          )}

          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..." 
            className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-5 py-3 text-white focus:border-primary transition outline-none"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-600 transition shrink-0"
          >
            <Send size={18} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}
