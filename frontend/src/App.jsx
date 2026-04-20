import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, Plus, Target, Zap, Clock, ShieldAlert, Award, Trash2, LogOut, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Setup global Axios interceptor
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  if (!token) {
    return <AuthScreen onLogin={setToken} />;
  }

  return <Dashboard onLogout={() => { localStorage.removeItem('token'); setToken(null); }} />;
}

function AuthScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!username || !password) return setErr('Заповніть всі поля');
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await axios.post(`${API_URL}${endpoint}`, { username, password });
      
      if (!isLogin) {
        // Automatically login after successful registration
        const loginRes = await axios.post(`${API_URL}/auth/login`, { username, password });
        localStorage.setItem('token', loginRes.data.token);
        onLogin(loginRes.data.token);
      } else {
        localStorage.setItem('token', res.data.token);
        onLogin(res.data.token);
      }
    } catch (err) {
      setErr(err.response?.data?.error || 'Помилка з\'єднання сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black z-0"></div>
      
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
            <Target size={32} className="text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          Intellectual Productivity
        </h2>

        {err && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">{err}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" value={username} onChange={e => setUsername(e.target.value)} 
            placeholder="Ім'я користувача" 
            className="w-full bg-slate-800/50 text-white rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
          />
          <input 
            type="password" value={password} onChange={e => setPassword(e.target.value)} 
            placeholder="Пароль" 
            className="w-full bg-slate-800/50 text-white rounded-xl px-4 py-3 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500"
          />
          <button 
            type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/25 mt-2 flex justify-center items-center h-12"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isLogin ? 'Увійти' : 'Створити акаунт')}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400 text-sm">
          {isLogin ? 'Ще не маєте акаунта?' : 'Вже є акаунт?'}
          <button onClick={() => { setIsLogin(!isLogin); setErr(''); }} className="text-blue-400 ml-2 hover:text-blue-300 font-semibold focus:outline-none">
            {isLogin ? 'Реєстрація' : 'Увійти'}
          </button>
        </p>
      </div>
    </div>
  );
}

function Dashboard({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({ username: '', total_xp: 0, level: 1 });
  const [title, setTitle] = useState('');
  const [is_important, setIsImportant] = useState(false);
  const [is_urgent, setIsUrgent] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard`);
      setUser(res.data.user);
      setTasks(res.data.tasks);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) onLogout();
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await axios.post(`${API_URL}/tasks`, { title, is_important, is_urgent });
      setTitle('');
      setIsImportant(false);
      setIsUrgent(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (id, e) => {
    try {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({ particleCount: 100, spread: 70, origin: { x, y }, colors: ['#3b82f6', '#ef4444', '#eab308', '#22c55e'] });
      await axios.patch(`${API_URL}/tasks/${id}/complete`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Остаточно видалити цю місію?')) return;
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const quadrants = {
    1: tasks.filter(t => t.quadrant === 1 && t.status === 'active'),
    2: tasks.filter(t => t.quadrant === 2 && t.status === 'active'),
    3: tasks.filter(t => t.quadrant === 3 && t.status === 'active'),
    4: tasks.filter(t => t.quadrant === 4 && t.status === 'active')
  };

  const xpToNextLevel = user.level * 100;
  const progressPercent = Math.min((user.total_xp % 100) / 100 * 100, 100);

  if (loading) {
    return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black z-0"></div>

      {/* Gamification Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/60 border-b border-slate-700/50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform">
              <Award className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{user.username}</h1>
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Рівень {user.level}</p>
            </div>
          </div>

          <div className="flex-1 w-full max-w-2xl px-2">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5 px-1">
              <span>{Math.floor(user.total_xp / 100) * 100} XP</span>
              <span className="text-blue-400 drop-shadow-sm">{user.total_xp} XP</span>
              <span>{xpToNextLevel} XP</span>
            </div>
            <div className="w-full bg-slate-800/80 rounded-full h-3 border border-slate-700/50 overflow-hidden shadow-inner relative">
              <div 
                className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-1000 ease-out relative" 
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse border-r border-white/50"></div>
              </div>
            </div>
          </div>

          <button onClick={onLogout} title="Вийти з акаунта" className="bg-slate-800 hover:bg-slate-700 p-3 rounded-2xl border border-slate-700/50 transition-colors">
            <LogOut size={20} className="text-slate-400" />
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-10 pb-20 relative z-10">
        
        {/* Task Form */}
        <form onSubmit={handleAddTask} className="bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 shadow-2xl mb-12 flex flex-col lg:flex-row items-center gap-6 group hover:border-slate-600/50 transition-colors">
          <div className="w-full lg:flex-1 relative">
            <input 
              type="text" value={title} onChange={e => setTitle(e.target.value)} 
              placeholder="Яка ваша наступна місія?" 
              className="w-full bg-slate-900/50 text-white rounded-2xl px-5 py-4 pl-12 border border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner text-lg placeholder:text-slate-500"
            />
            <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          </div>
          
          <div className="flex bg-slate-900/50 p-2 rounded-2xl border border-slate-700/60 w-full lg:w-auto h-[60px]">
            <label className={`flex-1 lg:w-36 flex justify-center items-center gap-2 cursor-pointer rounded-xl transition-all ${is_important ? 'bg-red-500/20 text-red-400 shadow-[inset_0_0_12px_rgba(239,68,68,0.2)]' : 'hover:bg-slate-800 text-slate-400'}`}>
              <input type="checkbox" checked={is_important} onChange={() => setIsImportant(!is_important)} className="hidden"/> 
              <ShieldAlert size={18} /> Важливо
            </label>
            <div className="w-px bg-slate-700/50 mx-1"></div>
            <label className={`flex-1 lg:w-36 flex justify-center items-center gap-2 cursor-pointer rounded-xl transition-all ${is_urgent ? 'bg-yellow-500/20 text-yellow-400 shadow-[inset_0_0_12px_rgba(234,179,8,0.2)]' : 'hover:bg-slate-800 text-slate-400'}`}>
              <input type="checkbox" checked={is_urgent} onChange={() => setIsUrgent(!is_urgent)} className="hidden"/> 
              <Zap size={18} /> Терміново
            </label>
          </div>

          <button 
            type="submit" disabled={!title.trim()}
            className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-white py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            <Plus size={20} strokeWidth={3} /> Додати
          </button>
        </form>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 min-h-[400px]">
          <QuadrantBlock 
            title="Зробіть негайно" 
            desc="(Q1: Важливо і Терміново) · 30 XP"
            tasks={quadrants[1]} onComplete={handleComplete} onDelete={handleDelete} colorScheme="red"
            icon={<ShieldAlert className="text-red-400" size={24} />}
          />
          <QuadrantBlock 
            title="Заплануйте" 
            desc="(Q2: Важливо, Не Терміново) · 20 XP"
            tasks={quadrants[2]} onComplete={handleComplete} onDelete={handleDelete} colorScheme="blue"
            icon={<Target className="text-blue-400" size={24} />}
          />
          <QuadrantBlock 
            title="Делегуйте" 
            desc="(Q3: Не важливо, Терміново) · 10 XP"
            tasks={quadrants[3]} onComplete={handleComplete} onDelete={handleDelete} colorScheme="yellow"
            icon={<Zap className="text-yellow-400" size={24} />}
          />
          <QuadrantBlock 
            title="Відкиньте" 
            desc="(Q4: Не важливо, Не Терміново) · 5 XP"
            tasks={quadrants[4]} onComplete={handleComplete} onDelete={handleDelete} colorScheme="slate"
            icon={<Clock className="text-slate-400" size={24} />}
          />
        </div>
      </main>
    </div>
  );
}

function QuadrantBlock({ title, desc, tasks, onComplete, onDelete, colorScheme, icon }) {
  const colors = {
    red: 'from-red-500/10 to-red-900/5 hover:from-red-500/20 border-red-500/20 hover:border-red-500/40 text-red-400 shadow-red-500/5',
    blue: 'from-blue-500/10 to-blue-900/5 hover:from-blue-500/20 border-blue-500/20 hover:border-blue-500/40 text-blue-400 shadow-blue-500/5',
    yellow: 'from-yellow-500/10 to-amber-900/5 hover:from-yellow-500/20 border-yellow-500/20 hover:border-yellow-500/40 text-yellow-400 shadow-yellow-500/5',
    slate: 'from-slate-700/10 to-slate-800/5 hover:from-slate-600/20 border-slate-600/20 hover:border-slate-500/40 text-slate-400 shadow-slate-500/5'
  }[colorScheme];

  return (
    <div className={`bg-gradient-to-br backdrop-blur-md rounded-3xl p-6 border transition-all duration-300 flex flex-col shadow-xl ${colors}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-slate-900/50 p-3 rounded-2xl shadow-inner border border-white/5">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
          <p className="text-xs lg:text-sm font-medium opacity-80 mt-1">{desc}</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 min-h-[150px]">
        {tasks.length === 0 ? (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-600/30 rounded-2xl p-6 text-center">
            <span className="text-sm font-medium opacity-50">Немає активних завдань</span>
          </div>
        ) : (
          tasks.map(task => <TaskCard key={task.id} task={task} onComplete={onComplete} onDelete={onDelete} colorScheme={colorScheme} />)
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, onComplete, onDelete, colorScheme }) {
  const hoverColors = {
    red: 'hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)]',
    blue: 'hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]',
    yellow: 'hover:border-yellow-500/50 hover:shadow-[0_0_15px_rgba(234,179,8,0.15)]',
    slate: 'hover:border-slate-500/50 hover:shadow-[0_0_15px_rgba(100,116,139,0.15)]'
  }[colorScheme];

  const checkHoverColor = {
    red: 'hover:text-red-400 hover:bg-red-500/10',
    blue: 'hover:text-blue-400 hover:bg-blue-500/10',
    yellow: 'hover:text-yellow-400 hover:bg-yellow-500/10',
    slate: 'hover:text-slate-400 hover:bg-slate-500/10'
  }[colorScheme];

  return (
    <div className={`bg-slate-900/60 p-4 rounded-2xl flex justify-between items-center group border border-slate-700/50 transition-all duration-300 transform hover:-translate-y-1 ${hoverColors}`}>
      <span className="text-[15px] font-medium text-slate-200 leading-snug pr-4">{task.title}</span>
      <div className="flex gap-1 flex-shrink-0">
        <button 
          onClick={(e) => onComplete(task.id, e)} 
          className={`p-2 text-slate-500 rounded-full transition-all duration-300 focus:outline-none ${checkHoverColor}`}
          title="Завершити місію"
        >
          <CheckCircle2 size={24} strokeWidth={2.5} className="transition-transform hover:scale-110" />
        </button>
        <button 
          onClick={() => onDelete(task.id)} 
          className="p-2 text-slate-500 rounded-full transition-all duration-300 focus:outline-none hover:text-red-500 hover:bg-red-500/10"
          title="Видалити місію"
        >
          <Trash2 size={20} className="transition-transform hover:scale-110" />
        </button>
      </div>
    </div>
  );
}

export default App;
