import { MessageCircleHeart } from 'lucide-react';
import { useState } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: newMessages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', text: m.text }))
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: 'দুঃখিত, সমস্যা হয়েছে।' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-20 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
          <div className="bg-primary text-white p-3 rounded-t-lg flex justify-between items-center">
            <span>Customer Support</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`p-2 rounded-lg max-w-[80%] ${m.role === 'user' ? 'bg-primary text-white ml-auto' : 'bg-gray-100'}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="text-gray-400 text-sm">লিখছে...</div>}
          </div>
          <div className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="প্রশ্ন লিখুন..."
              className="input input-bordered input-sm flex-1"
            />
            <button onClick={sendMessage} className="btn btn-primary btn-sm">Send</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="btn btn-circle btn-primary btn-lg">
            <MessageCircleHeart size={40}/>
        </button>
      )}
    </div>
  );
}