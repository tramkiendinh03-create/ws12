import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../../types';
import MetalContainer from '../UI/MetalContainer';
import { Send, Terminal } from 'lucide-react';

interface ChatTerminalProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
}

const ChatTerminal: React.FC<ChatTerminalProps> = ({ messages, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <MetalContainer className="h-full flex flex-col" title="神经链接终端 [NEURAL_LINK]" noPadding>
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 relative" ref={scrollRef}>
             {/* Decorative watermark */}
             <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                <Terminal size={200} />
             </div>

            {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isSystem = msg.sender === 'system';
                
                return (
                    <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                        <div 
                            className={`max-w-[80%] rounded-lg p-3 border backdrop-blur-sm relative text-sm leading-relaxed
                            ${isSystem 
                                ? 'w-full border-yellow-500/30 bg-yellow-900/10 text-yellow-200 font-mono text-xs' 
                                : isUser 
                                    ? 'bg-tech-blue/10 border-tech-blue/30 text-gray-100 rounded-tr-none' 
                                    : 'bg-white/5 border-white/10 text-gray-300 rounded-tl-none'
                            }
                            `}
                        >
                            {!isUser && !isSystem && <div className="text-[10px] text-gray-500 mb-1 font-bold tracking-wider">LILITH V. AKRA</div>}
                            {isSystem && <div className="text-[10px] text-yellow-500 mb-1 font-bold tracking-wider flex items-center gap-1"><Terminal size={10}/> SYSTEM NOTIFICATION</div>}
                            
                            {msg.content}
                            
                            <div className={`text-[9px] mt-1 opacity-50 ${isUser ? 'text-right' : 'text-left'}`}>
                                {msg.timestamp}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/40 border-t border-white/10 backdrop-blur-md">
            <div className="relative flex items-end gap-2">
                <div className="flex-1 relative group">
                     {/* Input Glow Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-tech-blue to-blue-600 rounded opacity-20 group-hover:opacity-50 transition duration-500 blur"></div>
                    
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="输入指令或对话..."
                        className="relative w-full bg-black/80 border border-white/10 text-white p-3 rounded focus:outline-none focus:border-tech-blue/50 focus:ring-1 focus:ring-tech-blue/50 placeholder-gray-600 resize-none h-14 text-sm font-sans"
                    />
                </div>
                <button 
                    onClick={handleSend}
                    className="h-14 w-14 flex items-center justify-center bg-tech-blue/10 border border-tech-blue/30 text-tech-blue rounded hover:bg-tech-blue hover:text-black transition-all duration-300 active:scale-95 group shadow-[0_0_10px_rgba(0,243,255,0.2)]"
                >
                    <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
            </div>
        </div>
    </MetalContainer>
  );
};

export default ChatTerminal;