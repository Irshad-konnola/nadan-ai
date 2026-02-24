'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  // 1. Manually manage input state (v6 removed this from useChat)
  const [input, setInput] = useState('');
  
  // 2. Extract the new v6 properties
  const { messages, sendMessage, status } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 3. isLoading is now derived from the 'status' property
  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // 4. Send the message using the new v6 format
    sendMessage({ text: input });
    setInput('');
  };

  // Auto-scroll to the bottom of the chat when a new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="flex flex-col h-screen max-w-2xl mx-auto p-4 bg-gray-50">
      <header className="py-6 border-b mb-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-green-700">Next Vibes AI</h1>
        <p className="text-sm text-gray-500 mt-1">Your personal nutritionist who speaks your language.</p>
      </header>

      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-24 px-2">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p>Try saying: "Inn ravile 2 idlium sambarum kazhichu"</p>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`p-4 rounded-2xl max-w-[85%] ${
              m.role === 'user' 
                ? 'bg-green-600 text-white rounded-br-none shadow-md' 
                : 'bg-white shadow-sm border border-gray-100 rounded-bl-none text-gray-800'
            }`}>
              
              {/* 5. V6 Messages are arrays of "parts" */}
              {m.parts.map((part, index) => {
                
                // Render normal text
                if (part.type === 'text') {
                  return <div key={index}>{part.text}</div>;
                }
                
                // 6. Render tool badges dynamically based on the part state
                if (part.type === 'tool-logFood' && part.state === 'output-available') {
                  return (
                    <div key={index} className="text-xs text-green-700 mt-2 pl-2 bg-green-50 p-1.5 rounded-md border border-green-200 shadow-sm flex items-center gap-1">
                      <span>✓</span> Database updated: {(part.input as any)?.calories} kcal logged
                    </div>
                  );
                }
                
                return null;
              })}

            </div>
          </div>
        ))}
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="text-sm text-gray-400 animate-pulse pl-2">NutriVibe is thinking...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="fixed bottom-0 left-0 right-0 max-w-2xl mx-auto p-4 bg-gray-50/90 backdrop-blur-md border-t border-gray-200">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What did you eat today? (Manglish works perfectly!)"
            className="flex-1 border border-gray-300 p-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-gray-800"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-medium transition-colors disabled:opacity-50 shadow-md"
          >
            Send
          </button>
        </div>
      </form>
    </main>
  );
}