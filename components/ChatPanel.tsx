import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { Send, Sparkles } from 'lucide-react';

interface ChatPanelProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, isLoading, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="w-full md:w-[35%] lg:w-[30%] h-[40vh] md:h-full bg-stone-900 text-stone-200 flex flex-col border-b md:border-b-0 md:border-r border-stone-800 shadow-2xl z-10">
      {/* Header */}
      <div className="p-6 border-b border-stone-800 bg-stone-900">
        <h1 className="text-2xl font-serif text-white tracking-wide flex items-center gap-2">
          HALFART
        </h1>
        <p className="text-stone-500 text-xs uppercase tracking-widest mt-1 font-medium">NYC Art Companion</p>
        <p className="text-stone-400 text-sm mt-4 leading-relaxed">
          I scan real-time NYC exhibition data. Tell me where you are or what you like, and I'll curate your gallery run.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 dark-scroll">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[10px] text-stone-600 mb-1 uppercase tracking-wider">
              {msg.role === 'user' ? 'You' : 'Halfart'}
            </span>
            <div
              className={`max-w-[90%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-stone-800 text-white rounded-tr-sm'
                  : 'bg-stone-950 border border-stone-800 text-stone-300 rounded-tl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start animate-pulse">
            <span className="text-[10px] text-stone-600 mb-1 uppercase tracking-wider">
              Halfart
            </span>
            <div className="bg-stone-950 border border-stone-800 rounded-2xl rounded-tl-sm p-4 text-sm flex items-center gap-2 text-stone-500">
              <Sparkles size={14} className="animate-spin" />
              <span>Curating galleries...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-stone-800 bg-stone-900">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your plan..."
            className="w-full bg-stone-800 text-white rounded-full py-4 pl-6 pr-14 focus:outline-none focus:ring-1 focus:ring-stone-600 placeholder-stone-500 text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white text-stone-900 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};