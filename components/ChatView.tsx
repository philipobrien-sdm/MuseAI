import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/gemini';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your creative assistant. How can I help you with your writing or art today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Format history for Gemini API
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    try {
      const responseText = await sendChatMessage(history, userMessage.text);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
            <span className="material-symbols-rounded text-white">smart_toy</span>
        </div>
        <div>
            <h3 className="font-semibold">Creative Assistant</h3>
            <p className="text-xs text-slate-400">Powered by Gemini 3.0 Pro</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white text-slate-700 border border-slate-200 shadow-sm rounded-bl-none'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
               <div className="flex gap-1">
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                 <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
        >
          <input
            type="text"
            className="flex-1 border border-slate-200 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-slate-800"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-rounded">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;