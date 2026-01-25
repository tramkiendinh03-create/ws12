import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { GlassPanel } from './ui/GlassPanel';
import { Send, Sparkles, AlertCircle } from 'lucide-react';
import { generateGameResponse } from '../services/geminiService';

interface Props {
  history: ChatMessage[];
  setHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  gameState: any;
}

export const ChatInterface: React.FC<Props> = ({ history, setHistory, gameState }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setHistory(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Call LLM
    const responseText = await generateGameResponse(history, input, gameState);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: responseText,
      timestamp: Date.now()
    };

    setHistory(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex h-full flex-col">
      {/* Messages Area */}
      <GlassPanel className="relative mb-4 flex flex-1 flex-col" hoverEffect={false}>
         {/* Decorative Background Element */}
         <div className="bg-magic-purple/5 pointer-events-none absolute top-1/2 left-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" />

        <div className="flex-1 space-y-6 overflow-y-auto p-4" ref={scrollRef}>
            {history.length === 0 && (
                <div className="flex h-full flex-col items-center justify-center text-gray-500 opacity-60">
                    <Sparkles size={48} className="mb-4 animate-pulse text-purple-500" />
                    <p className="font-serif italic">命运的齿轮开始转动...</p>
                    <p className="mt-2 text-xs">请输入行动指令开始游戏</p>
                </div>
            )}
            
            {history.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div 
                        className={`max-w-[85%] rounded-2xl border p-4 shadow-lg backdrop-blur-sm ${
                            msg.role === 'user' 
                                ? 'bg-crimson-900/30 border-crimson-500/20 rounded-br-none text-gray-100' 
                                : 'rounded-bl-none border-white/5 bg-black/40 text-gray-200'
                        }`}
                    >
                        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'model' ? 'font-serif' : 'font-sans'}`}>
                            {msg.content}
                        </p>
                    </div>
                </div>
            ))}

            {isLoading && (
                 <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl rounded-bl-none border border-white/5 bg-black/40 p-4">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-purple-500" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-purple-500" style={{ animationDelay: '150ms' }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-purple-500" style={{ animationDelay: '300ms' }} />
                    </div>
                 </div>
            )}
        </div>
      </GlassPanel>

      {/* Input Area */}
      <div className="relative z-10">
        <div className="bg-void-900 absolute -top-3 left-4 rounded border border-white/5 px-2 text-[10px] text-gray-500 shadow-sm">
            行动指令
        </div>
        <div className="bg-void-800/80 flex items-end gap-2 rounded-xl border border-white/10 p-2 shadow-2xl backdrop-blur-md transition-colors focus-within:border-crimson-500/50">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="描述你的行动，例如：'轻轻抚摸她的脸颊，发动魅惑技能...' "
                className="max-h-[120px] min-h-[50px] w-full resize-none border-none bg-transparent p-3 text-sm text-gray-200 placeholder-gray-600 focus:ring-0"
                rows={1}
            />
            <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className={`flex items-center justify-center rounded-lg p-3 transition-all ${
                    input.trim() 
                        ? 'from-crimson-600 to-crimson-800 bg-gradient-to-br text-white shadow-lg hover:scale-105 active:scale-95' 
                        : 'cursor-not-allowed bg-white/5 text-gray-600'
                }`}
            >
                <Send size={18} />
            </button>
        </div>
      </div>
      
      {/* Modal Placeholders (Hidden logic for demo, but demonstrating readiness) */}
      {/* Logic would go here: {showModal && <Modal ... />} */}
    </div>
  );
};
