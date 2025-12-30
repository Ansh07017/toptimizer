
import React, { useState } from 'react';
import { X, Calendar, Clock, Sparkles, Book, Target, List } from 'lucide-react';

interface TaskEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: { label: string; type: 'subject' | 'topic' | 'task'; hours: number; days: string[] }) => void;
}

const TaskEntryModal: React.FC<TaskEntryModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [label, setLabel] = useState('');
  const [hours, setHours] = useState(2);
  const [taskType, setTaskType] = useState<'subject' | 'topic' | 'task'>('subject');
  const [days, setDays] = useState<string[]>([]);

  if (!isOpen) return null;

  const weekDays = [
    { id: 'day_mon', label: 'Monday', short: 'M' },
    { id: 'day_tue', label: 'Tuesday', short: 'T' },
    { id: 'day_wed', label: 'Wednesday', short: 'W' },
    { id: 'day_thu', label: 'Thursday', short: 'T' },
    { id: 'day_fri', label: 'Friday', short: 'F' },
    { id: 'day_sat', label: 'Saturday', short: 'S' },
    { id: 'day_sun', label: 'Sunday', short: 'S' },
  ];

  const toggleDay = (dayId: string) => {
    setDays(prev => prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    onAddTask({ label, type: taskType, hours, days });
    setLabel('');
    setHours(2);
    setTaskType('subject');
    setDays([]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <form onSubmit={handleSubmit} className="frosted-obsidian w-full max-w-2xl rounded-[4rem] border border-white/10 p-12 relative animate-in zoom-in duration-300">
        <button type="button" onClick={onClose} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <header className="mb-12">
           <h3 className="text-xs font-black uppercase tracking-[0.4em] text-violet-500 mb-2">Module Entry Logic</h3>
           <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Add Task Module</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-8">
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <List size={12} /> Module Label
                 </label>
                 <input 
                    type="text"
                    required
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Enter academic module name..."
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-violet-500/50"
                 />
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Book size={12} /> Structural Tier
                 </label>
                 <select 
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as any)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-violet-500/50 appearance-none"
                 >
                    <option value="subject">Academic Subject</option>
                    <option value="topic">General Topic</option>
                    <option value="task">Specific Assignment</option>
                 </select>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Target size={12} /> Scheduling Parameters
                 </label>
                 <div className="flex flex-wrap gap-3">
                    {weekDays.map((day) => (
                       <button 
                         key={day.id} 
                         type="button"
                         onClick={() => toggleDay(day.id)}
                         className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black transition-all border ${
                           days.includes(day.id) 
                             ? 'bg-violet-600 border-violet-500 text-white' 
                             : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'
                         }`}
                         title={day.label}
                       >
                          {day.short}
                       </button>
                    ))}
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Time Resource (Hours)</label>
                    <span className="text-xl font-black text-violet-400 font-mono">{hours}h</span>
                 </div>
                 <input 
                    type="range" min="0.5" max="12" step="0.5" value={hours}
                    onChange={(e) => setHours(parseFloat(e.target.value))}
                    className="w-full accent-violet-600 h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
                 />
                 {hours >= 6 && (
                    <div className="p-4 bg-lime-500/10 border border-lime-500/20 rounded-2xl flex items-center gap-3">
                       <Sparkles size={16} className="text-lime-500" />
                       <span className="text-[10px] font-black text-lime-400 uppercase tracking-widest">Resource Allocation: Substantial</span>
                    </div>
                 )}
              </div>

              <div className="p-8 bg-black/20 rounded-[2.5rem] border border-white/5">
                 <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Execution Projection</h4>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                       <span className="text-slate-500">Resource Intensity:</span>
                       <span className="text-white font-mono">{hours > 4 ? 'High' : 'Nominal'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                       <span className="text-slate-500">Frequency:</span>
                       <span className="text-white font-mono">{days.length > 0 ? `${days.length} Cycles` : 'On-demand'}</span>
                    </div>
                 </div>
              </div>

              <button 
                type="submit"
                className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-violet-500 hover:text-white transition-all shadow-xl mt-4"
              >
                 Commit to Schedule
              </button>
           </div>
        </div>
      </form>
    </div>
  );
};

export default TaskEntryModal;
