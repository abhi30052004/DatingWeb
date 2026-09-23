import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Send, ArrowLeft, MoreVertical, MessageCircle, Smile, Search, Mic, X, MapPin, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { API_URL, WS_URL } from '../services/api';

export default function Messages() {
  const { matchId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [matches, setMatches] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true); // For chat messages
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulated online status for demo
  const isOnline = true;

  // Fetch matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_URL}/swipes/matches`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setMatches(data);
        }
      } catch (err: any) {
        toast.error("Failed to fetch matches");
      } finally {
        setMatchesLoading(false);
      }
    };

    fetchMatches();
  }, [navigate]);

  // Initialize chat data and WebSocket
  useEffect(() => {
    if (!matchId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const fetchInitialMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/messages/${matchId}`, {
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

    // Initialize WebSocket - pass token as query param for auth
    const token = localStorage.getItem('token');
    const wsUrl = `${WS_URL}/messages/ws/${matchId}?token=${token}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecordingAndSend = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioMessage(audioBlob);
        
        if (mediaRecorderRef.current?.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
        setRecordingTime(0);
        if (timerRef.current) clearInterval(timerRef.current);
      };
      mediaRecorderRef.current.stop();
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = () => {
        if (mediaRecorderRef.current?.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
        setIsRecording(false);
        setRecordingTime(0);
        if (timerRef.current) clearInterval(timerRef.current);
      };
      mediaRecorderRef.current.stop();
    }
  };

  const sendAudioMessage = async (audioBlob: Blob) => {
    if (!matchId) return;
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice_message.webm');
      formData.append('match_id', matchId);

      const res = await fetch(`${API_URL}/messages/audio`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (!res.ok) {
        toast.error("Failed to send voice message");
      }
    } catch (err) {
      toast.error("Network error");
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !matchId) return;

    const messageText = input;
    setInput('');
    setShowEmojiPicker(false); // Close picker on send

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/messages/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ match_id: matchId, content: messageText })
      });
      
      if (!res.ok) {
        toast.error("Failed to send message");
        setInput(messageText); // Restore on fail
      }
    } catch (err) {
      toast.error("Network error");
      setInput(messageText);
    }
  };

  const activeMatch = matches.find(m => m.match_id === matchId);

  return (
    <div className="h-full flex bg-background overflow-hidden relative">
      
      {/* LEFT SIDEBAR (Matches List) */}
      <div className={`w-full md:w-80 lg:w-[400px] flex flex-col border-r border-slate-800 bg-[#111b21] h-full shrink-0 transition-transform ${matchId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 bg-[#202c33] flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Chats</h2>
          <button className="p-2 text-gray-400 hover:text-white transition">
            <MoreVertical size={20} />
          </button>
        </div>
        <div className="p-2 bg-[#111b21]">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search or start new chat" 
              className="w-full bg-[#202c33] rounded-lg py-1.5 pl-12 pr-4 text-sm text-white focus:outline-none transition placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {matchesLoading ? (
            <div className="flex justify-center p-8">
              <span className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : matches.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
              <p>No matches yet.</p>
            </div>
          ) : (
            <div className="flex flex-col mt-1">
              {matches.map(match => (
                <button
                  key={match.match_id}
                  onClick={() => navigate(`/messages/${match.match_id}`)}
                  className={`w-full flex items-center gap-3 px-3 py-2 transition hover:bg-[#202c33] ${matchId === match.match_id ? 'bg-[#2a3942]' : ''}`}
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-700 ml-1">
                    <img 
                      src={match.profile_photo || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80'} 
                      alt={match.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-left min-w-0 border-b border-slate-800/50 pb-3 pt-2">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-semibold text-white truncate capitalize text-[15px]">{match.name}</h4>
                      <span className="text-xs text-gray-500">
                        {match.created_at ? new Date(match.created_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="text-[13px] text-gray-400 truncate">Tap to view chat...</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT MAIN AREA (Active Chat) */}
      <div className={`flex-1 flex-col h-full bg-[#0b141a] relative ${!matchId ? 'hidden md:flex' : 'flex'}`}>
        {!matchId ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400 bg-[#222e35] border-l border-slate-800">
            <div className="w-24 h-24 rounded-full bg-slate-800/30 flex items-center justify-center mb-6">
              <MessageCircle size={40} className="text-slate-500" />
            </div>
            <h2 className="text-3xl font-light text-gray-200 mb-4">Pairly Web</h2>
            <p className="text-sm">Select a match from the sidebar to start chatting.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="bg-[#202c33] p-2.5 flex items-center justify-between z-10 shrink-0 shadow-sm border-l border-slate-800">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/messages')} className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-gray-400 hover:text-white transition md:hidden">
                  <ArrowLeft size={20} />
                </button>
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-700 cursor-pointer" onClick={() => setShowProfileSidebar(true)}>
                  <img 
                    src={activeMatch?.profile_photo || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80'} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col cursor-pointer" onClick={() => setShowProfileSidebar(true)}>
                  <h3 className="font-semibold text-white capitalize text-[15px]">{activeMatch ? activeMatch.name : 'Loading...'}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <p className="text-[12px] text-gray-400">{isOnline ? 'Online' : 'Offline'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            {loading ? (
              <div className="flex-1 flex items-center justify-center bg-[#0b141a]">
                <span className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <div 
                className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2.5 pb-24" 
                onClick={() => setShowEmojiPicker(false)}
                style={{
                  backgroundImage: `url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundBlendMode: 'overlay',
                  backgroundColor: 'rgba(11, 20, 26, 0.95)'
                }}
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center mt-10">
                    <div className="bg-[#182229] rounded-lg px-4 py-2 text-center text-[12.5px] text-[#8696a0] shadow-sm max-w-sm mx-auto">
                      <p>Messages are end-to-end encrypted. No one outside of this chat, not even Pairly, can read or listen to them.</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = msg.sender_id === user?._id;
                    return (
                      <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] md:max-w-[65%] px-3 py-1.5 text-[14.5px] leading-[19px] shadow-sm relative ${
                          isMe 
                            ? 'bg-[#005c4b] text-[#e9edef] rounded-lg rounded-tr-sm' 
                            : 'bg-[#202c33] text-[#e9edef] rounded-lg rounded-tl-sm'
                        }`}>
                          {msg.type === 'audio' ? (
                            <div className="pt-1 pb-2">
                              <audio controls src={msg.content} className="h-10 max-w-[200px] md:max-w-[250px]" />
                            </div>
                          ) : (
                            <span>{msg.content}</span>
                          )}
                          <div className="flex justify-end items-center mt-0.5 min-w-[50px]">
                             <span className="text-[11px] text-white/50 select-none">
                               {new Date(msg.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input Area */}
            <div className="absolute bottom-0 w-full bg-[#202c33] px-4 py-2 flex flex-col z-10">
              {isRecording ? (
                <div className="flex items-center gap-4 w-full h-[48px]">
                  <button 
                    onClick={cancelRecording}
                    className="p-2 text-red-500 hover:text-red-400 transition"
                  >
                    <Trash2 size={24} />
                  </button>
                  <div className="flex-1 flex items-center justify-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white text-[15px] tabular-nums tracking-wide font-medium">{formatTime(recordingTime)}</span>
                  </div>
                  <button 
                    onClick={stopRecordingAndSend}
                    className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center transition shrink-0 text-white hover:bg-[#00c59b]"
                  >
                    <Send size={18} className="ml-0.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={sendMessage} className="flex items-center gap-3 relative w-full">
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 rounded-full flex items-center justify-center text-[#8696a0] hover:text-[#d1d7db] transition"
                    >
                      <Smile size={26} />
                    </button>
                  </div>
                  
                  {showEmojiPicker && (
                    <div className="absolute bottom-16 left-0 z-50 shadow-2xl">
                      <EmojiPicker onEmojiClick={onEmojiClick} theme={Theme.DARK} />
                    </div>
                  )}

                  <div className="flex-1 bg-[#2a3942] rounded-lg overflow-hidden flex items-center px-2 py-0.5">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message" 
                      className="w-full bg-transparent px-2 py-2 text-[15px] text-white focus:outline-none placeholder-[#8696a0]"
                    />
                  </div>
                  
                  {input.trim() ? (
                    <button 
                      type="submit" 
                      className="w-10 h-10 rounded-full flex items-center justify-center transition shrink-0 text-[#00a884] hover:text-[#00c59b]"
                    >
                      <Send size={24} />
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={startRecording}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition shrink-0 text-[#8696a0] hover:text-[#d1d7db]"
                    >
                      <Mic size={24} />
                    </button>
                  )}
                </form>
              )}
            </div>
          </>
        )}
      </div>

      {/* PROFILE SIDEBAR (Right) */}
      {showProfileSidebar && activeMatch && (
        <div className="w-full md:w-80 lg:w-[350px] flex flex-col border-l border-slate-800 bg-[#111b21] h-full shrink-0 z-20 absolute md:relative right-0 transition-transform">
          <div className="p-4 bg-[#202c33] flex items-center gap-4 border-b border-slate-800">
            <button onClick={() => setShowProfileSidebar(false)} className="text-gray-400 hover:text-white transition">
              <X size={24} />
            </button>
            <h2 className="text-lg font-bold text-white">Contact info</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden bg-slate-700 mb-6 shadow-xl border-4 border-[#202c33]">
              <img 
                src={activeMatch.profile_photo || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'} 
                alt={activeMatch.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2 capitalize">{activeMatch.name}</h1>
            
            {activeMatch.city && (
              <div className="flex items-center gap-1.5 text-gray-400 mb-6">
                <MapPin size={16} />
                <span>{activeMatch.city}</span>
              </div>
            )}
            
            <div className="w-full bg-[#202c33] rounded-xl p-5 mb-4 shadow-sm border border-slate-800/50">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">About</h3>
              <p className="text-gray-200 text-sm leading-relaxed">{activeMatch.bio || "This user hasn't written a bio yet."}</p>
            </div>
            
            {activeMatch.interests && activeMatch.interests.length > 0 && (
              <div className="w-full bg-[#202c33] rounded-xl p-5 shadow-sm border border-slate-800/50">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {activeMatch.interests.map((interest: string, idx: number) => (
                    <span key={idx} className="bg-[#111b21] border border-slate-700/50 text-gray-300 text-xs px-3 py-1.5 rounded-full">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
