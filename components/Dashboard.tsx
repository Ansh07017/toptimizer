
import React, { useState, useEffect, useRef } from 'react';
import { Brain, Zap, Activity, ShieldAlert, Clock, Coffee, TrendingUp, Play, Pause, RotateCcw, Settings, Plus } from 'lucide-react';
import { Node, GlobalState } from '../types';

interface DashboardProps {
  state: GlobalState;
  onTaskAction: (node: Node) => void;
  addNotification: (msg: string, type?: 'info' | 'alert' | 'success') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onTaskAction, addNotification }) => {
  const [workMins, setWorkMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
  }, []);

  // Timer Logic
  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      audioRef.current?.play().catch(() => {});
      
      if (mode === 'work') {
        addNotification(`Execution sequence complete. Initiating ${breakMins}m recovery.`, 'success');
        setMode('break');
        setTimeLeft(breakMins * 60);
      } else {
        addNotification(`Recovery complete. Re-initiating ${workMins}m focus.`, 'info');
        setMode('work');
        setTimeLeft(workMins * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, workMins, breakMins, addNotification]);

  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setTimeLeft(workMins * 60);
  };

  const activeTasks = state.tasks.filter(t => t.status !== 'completed');
  const radius = 28;
  const circumference = 2 * Math.PI * radius;

  const kpiData = [
    { label: 'COGNITIVE_LOAD', val: activeTasks.length > 0 ? 64 : 0, color: '#f43f5e', icon: Brain }, 
    { label: 'BATTERY_LEVEL', val: state.mentalBattery, color: '#bef264', icon: Zap },
    { label: 'EFFICIENCY_RATIO', val: activeTasks.length > 0 ? 75 : 0, color: '#8b5cf6', icon: Activity, display: activeTasks.length > 0 ? '1.4 P' : '0.0 P' },
    { label: 'SYSTEM_STABILITY', val: activeTasks.length > 0 ? 94 : 100, color: '#8b5cf6', icon: ShieldAlert },
  ];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((stat, i) => {
          const offset = circumference - (stat.val / 100) * circumference;
          return (
            <div key={i} className="frosted-obsidian p-6 rounded-[2.5rem] flex items-center gap-6 border-white/5 relative">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.03)" strokeWidth="6" fill="transparent" />
                  <circle cx="50" cy="50" r={radius} stroke={stat.color} strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                   <stat.icon className="text-white/40" size={24} />
                </div>
              </div>
              <div>
                <p className="text-[9px] font-black tracking-[0.2em] text-slate-500 uppercase mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-white tracking-tighter">{stat.display || `${stat.val}%`}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Focus Timer Unit */}
        <div className="frosted-obsidian p-8 rounded-[3rem] relative overflow-hidden group border-white/5">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-violet-400 mb-8 flex items-center gap-3">
             <Clock size={16} /> Technical Execution Unit
          </h3>
          
          <div className="space-y-8 relative z-10 text-center">
             <div className="flex flex-col items-center gap-2 py-6">
                <p className={`text-[10px] font-black uppercase tracking-[0.4em] transition-colors ${mode === 'work' ? 'text-violet-500' : 'text-lime-500'}`}>
                   {mode === 'work' ? 'FOCUS_INTERVAL' : 'RECOVERY_INTERVAL'}
                </p>
                <p className="text-7xl font-black text-white tracking-tighter font-mono">{formatTime(timeLeft)}</p>
             </div>

             <div className="flex gap-4">
                <button onClick={() => setIsActive(!isActive)} className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isActive ? 'bg-rose-600/10 text-rose-500 border border-rose-500/30' : 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-500/10'}`}>
                   {isActive ? <Pause size={16} /> : <Play size={16} />}
                   {isActive ? 'Pause' : 'Resume'}
                </button>
                <button onClick={resetTimer} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-slate-500 hover:text-white transition-all">
                   <RotateCcw size={18} />
                </button>
             </div>

             <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                   <span>Temporal Config</span>
                   <Settings size={12} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-left">
                   <div className="space-y-2">
                      <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Focus (M)</p>
                      <input type="number" min="1" max="120" value={workMins} onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setWorkMins(val);
                        if (mode === 'work' && !isActive) setTimeLeft(val * 60);
                      }} className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm font-black text-violet-400 outline-none focus:border-violet-500/30" />
                   </div>
                   <div className="space-y-2">
                      <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Recov (M)</p>
                      <input type="number" min="1" max="60" value={breakMins} onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setBreakMins(val);
                        if (mode === 'break' && !isActive) setTimeLeft(val * 60);
                      }} className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-sm font-black text-lime-400 outline-none focus:border-lime-500/30" />
                   </div>
                </div>
          </div>
          </div>
        </div>

        {/* Execution Sequence Stack */}
        <div className="lg:col-span-2 frosted-obsidian p-8 rounded-[3rem] border border-white/5 flex flex-col">
          <div className="flex justify-between items-center mb-10">
             <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-violet-400">Execution Stack</h3>
                <p className="text-[9px] text-slate-500 font-bold tracking-widest mt-1 uppercase">Substrate Status: {activeTasks.length > 0 ? 'NOMINAL' : 'EMPTY'}</p>
             </div>
             <div className="flex gap-2">
                <div className="px-3 py-1 rounded-md bg-violet-600/10 text-violet-500 text-[8px] font-black border border-violet-500/20 uppercase tracking-widest">Academic</div>
                <div className="px-3 py-1 rounded-md bg-slate-800 text-slate-500 text-[8px] font-black border border-white/5 uppercase tracking-widest">Technical</div>
             </div>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
             {activeTasks.length > 0 ? activeTasks.map((task, idx) => (
               <div key={task.id} className="relative h-20 group">
                  <div className="absolute left-0 top-0 h-full w-16 flex flex-col items-center justify-center border-r border-white/5">
                     <span className="text-[10px] font-black text-slate-600 font-mono">0{idx + 1}</span>
                  </div>
                  <div onClick={() => onTaskAction(task)} className="absolute left-20 h-full rounded-2xl p-4 flex items-center justify-between border border-white/5 transition-all duration-500 group-hover:translate-x-1 cursor-pointer bg-white/5 hover:bg-white/[0.08]" style={{ width: `calc(100% - 90px)` }}>
                    <div className="flex items-center gap-4">
                       <div className={`w-1.5 h-1.5 rounded-full ${task.type === 'subject' ? 'bg-violet-500' : 'bg-slate-500'}`}></div>
                       <div>
                         <h4 className="text-xs font-black text-white uppercase tracking-widest">{task.label}</h4>
                         <p className="text-[8px] font-bold text-slate-600 uppercase">MOD_UID: {task.id.split('-')[1]?.substring(0,6) || task.id.split('-')[0]}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black text-slate-600 uppercase">Intensity</p>
                       <p className={`text-lg font-black font-mono ${task.type === 'subject' ? 'text-violet-400' : 'text-slate-400'}`}>{task.cognitiveLoad}%</p>
                    </div>
                  </div>
               </div>
             )) : (
               <div className="flex-1 flex flex-col items-center justify-center opacity-10 gap-4 py-10">
                 <Plus size={48} className="text-slate-500" />
                 <p className="text-xs font-black uppercase tracking-[0.4em]">Initialize substrate modules</p>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="frosted-obsidian p-10 rounded-[4rem] border border-white/5 relative overflow-hidden">
         <div className="flex items-center gap-4 mb-10 text-violet-500">
            <TrendingUp size={24} />
            <h3 className="text-lg font-black text-white tracking-tighter uppercase italic">Complexity Index (λ)</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {activeTasks.length > 0 ? activeTasks.slice(0, 3).map((t) => {
              const isHigh = t.importance > 1.8;
              return (
                <div key={t.id} className={`p-8 rounded-[2.5rem] bg-white/5 border transition-all duration-700 flex flex-col justify-between h-56 ${isHigh ? 'border-rose-500/40 scale-[1.02]' : 'border-white/5'}`}>
                  <div>
                     <span className="text-[10px] font-black text-slate-600 tracking-widest uppercase mb-4 block">Penalty Vector</span>
                     <h4 className="text-2xl font-black text-white tracking-tight leading-tight uppercase">{t.label}</h4>
                  </div>
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[10px] font-black text-slate-600 tracking-widest uppercase">Magnitude</p>
                        <p className={`text-4xl font-black tracking-tighter ${isHigh ? 'text-rose-500' : 'text-violet-400'}`}>{t.importance}x</p>
                     </div>
                     <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${isHigh ? 'border-rose-500 text-rose-500' : 'border-slate-800 text-slate-600'}`}>
                        {isHigh ? 'CRITICAL' : 'QUEUED'}
                     </span>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-3 py-12 flex flex-col items-center justify-center opacity-10 gap-2">
                 <ShieldAlert size={32} />
                 <p className="text-[10px] font-black uppercase tracking-widest">No intensity data available</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
