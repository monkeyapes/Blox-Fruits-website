import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  MessageSquare, 
  Sun, 
  Moon, 
  User, 
  Lock, 
  Plus, 
  Trash2, 
  Sword,
  Gem,
  Zap,
  LayoutDashboard
} from 'lucide-react';

// --- Static Accounts & Initial Data ---
const ACCOUNTS = [
  { username: 'owner', password: '15pencils', role: 'owner', name: 'Main Owner' },
  { username: 'maneger', password: 'key15', role: 'admin', name: 'Manager' }
];

const INITIAL_STOCK = [
  { id: 1, name: 'Kitsune', type: 'Mythical', price: '4,000 Robux', stock: 1, image: '🦊' },
  { id: 2, name: 'Leopard', type: 'Mythical', price: '3,000 Robux', stock: 3, image: '🐆' },
  { id: 3, name: 'Dough', type: 'Mythical', price: '2,400 Robux', stock: 5, image: '🍩' },
  { id: 4, name: 'Buddha', type: 'Legendary', price: '1,200 Robux', stock: 15, image: '🙏' },
];

const RAIDS = [
  { id: 1, name: 'Dough King Raid', difficulty: 'Extreme', price: '1200', icon: '👑' },
  { id: 2, name: 'Law/Order Raid', difficulty: 'Hard', price: '600', icon: '⚔️' },
  { id: 3, name: 'Ice Awakening', difficulty: 'Medium', price: '300', icon: '❄️' },
  { id: 4, name: 'Light Awakening', difficulty: 'Medium', price: '300', icon: '✨' },
];

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [page, setPage] = useState('home'); // home, chat, dashboard, login
  const [user, setUser] = useState(null);
  const [stock, setStock] = useState(INITIAL_STOCK);
  
  // Chat Logic
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'System', text: 'Welcome to our service! Please message an admin to start an order.', type: 'system' }
  ]);

  // Form States
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [stockForm, setStockForm] = useState({ name: '', type: 'Legendary', price: '', stock: 1, image: '🍎' });
  const [error, setError] = useState('');

  // Handlers
  const handleLogin = (e) => {
    e.preventDefault();
    const found = ACCOUNTS.find(a => a.username === loginForm.username && a.password === loginForm.password);
    if (found) {
      setUser(found);
      setPage('dashboard');
      setError('');
      setChatHistory([...chatHistory, { id: Date.now(), sender: 'System', text: `${found.name} is now online.`, type: 'system' }]);
    } else {
      setError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPage('home');
  };

  const addStockItem = () => {
    if (!stockForm.name || !stockForm.price) return;
    setStock([...stock, { ...stockForm, id: Date.now() }]);
    setStockForm({ name: '', type: 'Legendary', price: '', stock: 1, image: '🍎' });
  };

  const deleteStockItem = (id) => {
    setStock(stock.filter(s => s.id !== id));
  };

  const sendChatMessage = (text) => {
    if (!text.trim()) return;
    const msg = {
      id: Date.now(),
      sender: user ? user.name : 'Customer',
      text: text,
      type: user ? (user.role === 'owner' ? 'owner' : 'admin') : 'customer'
    };
    setChatHistory([...chatHistory, msg]);
  };

  // UI Components
  const Navigation = () => (
    <nav className={`sticky top-0 z-50 p-4 flex justify-between items-center transition-all ${darkMode ? 'bg-black/80 backdrop-blur-md text-white border-b border-gray-800' : 'bg-white/80 backdrop-blur-md text-gray-900 border-b border-gray-200'}`}>
      <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setPage('home')}>
        <Sword className="w-8 h-8 text-blue-500 group-hover:rotate-12 transition-transform" />
        <span className="text-xl font-black tracking-tighter italic">BLOX<span className="text-blue-500">PRO</span></span>
      </div>

      <div className="flex items-center gap-6 font-bold text-sm uppercase tracking-widest">
        <button onClick={() => setPage('home')} className="hover:text-blue-500 transition">Services</button>
        <button onClick={() => setPage('chat')} className="hover:text-blue-500 transition">Live Chat</button>
        {user && <button onClick={() => setPage('dashboard')} className="text-purple-400 hover:text-purple-300 transition">Dashboard</button>}
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-500/20 transition">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full">{user.name}</span>
            <button onClick={handleLogout} className="text-red-500 text-xs font-bold hover:underline">Logout</button>
          </div>
        ) : (
          <button onClick={() => setPage('login')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold text-xs transition shadow-lg shadow-blue-500/20">
            STAFF LOGIN
          </button>
        )}
      </div>
    </nav>
  );

  const StockDisplay = ({ isAdmin = false }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stock.map(item => (
        <div key={item.id} className={`group relative p-5 rounded-3xl border transition-all hover:scale-[1.02] ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl'}`}>
          <div className="absolute -top-3 -right-3 w-12 h-12 flex items-center justify-center text-3xl bg-blue-500/10 rounded-2xl">
            {item.image}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest mb-1 block ${item.type === 'Mythical' ? 'text-red-500' : 'text-purple-500'}`}>
            {item.type}
          </span>
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</h3>
          <p className="text-xs text-gray-500 mb-4 font-medium">Stock: {item.stock}</p>
          <div className="flex justify-between items-center">
            <span className="text-green-500 font-black">{item.price}</span>
            {isAdmin ? (
              <button onClick={() => deleteStockItem(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition">
                <Trash2 size={18} />
              </button>
            ) : (
              <button onClick={() => setPage('chat')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl transition">
                ORDER
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const DashboardPanel = () => {
    const [activeTab, setActiveTab] = useState('stock');
    if (!user) return null;

    return (
      <div className="max-w-6xl mx-auto py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-4xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin Panel</h1>
            <p className="text-gray-500 font-medium">Manage stock and security settings.</p>
          </div>
          <div className="flex gap-2 bg-gray-500/10 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab('stock')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'stock' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-white'}`}
            >
              Inventory
            </button>
            {user.role === 'owner' && (
              <button 
                onClick={() => setActiveTab('security')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'security' ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-white'}`}
              >
                Security (Owner)
              </button>
            )}
          </div>
        </div>

        {activeTab === 'stock' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className={`lg:col-span-1 p-6 rounded-3xl h-fit border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl'}`}>
              <h3 className={`text-xl font-black mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Plus className="text-green-500" /> New Fruit
              </h3>
              <div className="space-y-4">
                <input 
                  className={`w-full p-3 rounded-xl text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-200'}`}
                  placeholder="Fruit Name"
                  value={stockForm.name}
                  onChange={e => setStockForm({...stockForm, name: e.target.value})}
                />
                <select 
                  className={`w-full p-3 rounded-xl text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-200'}`}
                  value={stockForm.type}
                  onChange={e => setStockForm({...stockForm, type: e.target.value})}
                >
                  <option>Common</option>
                  <option>Rare</option>
                  <option>Legendary</option>
                  <option>Mythical</option>
                </select>
                <input 
                  className={`w-full p-3 rounded-xl text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-100 border-gray-200'}`}
                  placeholder="Price (e.g. 500 Robux)"
                  value={stockForm.price}
                  onChange={e => setStockForm({...stockForm, price: e.target.value})}
                />
                <button 
                  onClick={addStockItem}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black transition shadow-lg shadow-green-500/20"
                >
                  ADD TO STOCK
                </button>
              </div>
            </div>
            <div className="lg:col-span-3">
              <StockDisplay isAdmin={true} />
            </div>
          </div>
        ) : (
          <div className={`p-8 rounded-3xl border border-red-500/20 ${darkMode ? 'bg-gray-900' : 'bg-white shadow-xl'}`}>
            <h2 className="text-2xl font-black text-red-500 mb-6 flex items-center gap-2">
              <Shield size={24} /> Admin Credentials
            </h2>
            <div className="space-y-4">
              {ACCOUNTS.map((acc, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div>
                    <span className="text-xs font-black uppercase tracking-tighter text-blue-500">{acc.role}</span>
                    <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{acc.name}</h4>
                  </div>
                  <div className="flex gap-10">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Username</p>
                      <p className="font-mono text-blue-400">{acc.username}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Password</p>
                      <p className="font-mono text-green-500">{acc.password}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const ChatComponent = () => {
    const [msgInput, setMsgInput] = useState('');
    const endRef = useRef(null);

    useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [chatHistory]);

    return (
      <div className="max-w-4xl mx-auto h-[700px] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
        <div className="bg-blue-600 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageSquare className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-white font-black leading-none">Live Support</h3>
              <span className="text-[10px] text-blue-100 font-bold uppercase tracking-widest">Average reply: 2 mins</span>
            </div>
          </div>
          {user && <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] text-white font-black uppercase">Staff Mode</span>}
        </div>
        
        <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
          {chatHistory.map(m => (
            <div key={m.id} className={`flex flex-col ${m.type === 'customer' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[75%] p-4 rounded-2xl text-sm ${
                m.type === 'system' ? 'bg-gray-500/10 text-gray-500 w-full text-center italic text-xs' :
                m.type === 'customer' ? 'bg-blue-600 text-white rounded-br-none' :
                m.type === 'owner' ? 'bg-red-600 text-white rounded-bl-none shadow-lg shadow-red-500/20' :
                'bg-purple-600 text-white rounded-bl-none shadow-lg shadow-purple-500/20'
              }`}>
                {m.type !== 'system' && <span className="block text-[10px] font-black uppercase opacity-70 mb-1">{m.sender}</span>}
                {m.text}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className={`p-4 border-t ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="flex gap-3">
            <input 
              className={`flex-1 p-4 rounded-2xl outline-none text-sm transition focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}
              placeholder="What service do you need help with?"
              value={msgInput}
              onChange={e => setMsgInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (sendChatMessage(msgInput), setMsgInput(''))}
            />
            <button 
              onClick={() => { sendChatMessage(msgInput); setMsgInput(''); }}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 rounded-2xl font-black transition shadow-lg shadow-blue-500/20"
            >
              SEND
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navigation />
      
      <main className="container mx-auto px-6 py-10">
        {page === 'home' && (
          <div className="space-y-16 animate-in fade-in duration-700">
            {/* Hero */}
            <div className="text-center space-y-4 pt-10">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase">
                Level Up <br /> <span className="text-blue-500">Fast & Safe</span>
              </h1>
              <p className="text-gray-500 font-bold text-lg max-w-xl mx-auto">
                Instant delivery fruits and expert raid assistance for the ultimate Blox Fruits experience.
              </p>
            </div>

            {/* Raids */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <Zap className="text-yellow-500" fill="currentColor" />
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Premium Raids</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RAIDS.map(r => (
                  <div key={r.id} className={`p-6 rounded-3xl border flex items-center justify-between transition-all hover:border-blue-500 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100 shadow-xl'}`}>
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-3xl">{r.icon}</div>
                      <div>
                        <h4 className="font-black text-lg">{r.name}</h4>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${r.difficulty === 'Extreme' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                          {r.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-blue-500">{r.price} Beli</p>
                      <button onClick={() => setPage('chat')} className="text-xs font-bold underline opacity-50 hover:opacity-100 transition">Request Raid</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Fruits */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <Gem className="text-purple-500" fill="currentColor" />
                <h2 className="text-3xl font-black uppercase italic tracking-tighter">Fruit Stock</h2>
              </div>
              <StockDisplay />
            </section>
          </div>
        )}

        {page === 'login' && (
          <div className="max-w-md mx-auto py-20">
            <div className={`p-10 rounded-[40px] border shadow-2xl ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
              <div className="text-center mb-8">
                <Shield className="mx-auto text-blue-500 mb-4" size={48} />
                <h2 className="text-3xl font-black tracking-tighter">STAFF PORTAL</h2>
                <p className="text-gray-500 text-sm font-medium">Verify your identity to proceed</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <input 
                  className={`w-full p-4 rounded-2xl outline-none font-bold ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}
                  placeholder="Admin Username"
                  value={loginForm.username}
                  onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                />
                <input 
                  type="password"
                  className={`w-full p-4 rounded-2xl outline-none font-bold ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'}`}
                  placeholder="Admin Password"
                  value={loginForm.password}
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                />
                {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
                <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition shadow-xl shadow-blue-500/30 active:scale-95">
                  AUTHORIZE ACCESS
                </button>
              </form>
            </div>
          </div>
        )}

        {page === 'chat' && <ChatComponent />}
        {page === 'dashboard' && <DashboardPanel />}
      </main>

      <footer className="py-20 text-center opacity-30 text-xs font-bold uppercase tracking-[0.2em]">
        &copy; 2024 BLOXPRO SERVICES &bull; FAST &bull; SECURE &bull; EXPERT
      </footer>
    </div>
  );
}
