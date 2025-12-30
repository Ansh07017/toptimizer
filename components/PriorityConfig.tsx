
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { GlobalState, Responsibility } from '../types';
import { Scale, Users, Briefcase, Heart, Zap, Activity, Info } from 'lucide-react';

interface PriorityConfigProps {
  state: GlobalState;
  onUpdate: (newState: GlobalState) => void;
}

const PriorityConfig: React.FC<PriorityConfigProps> = ({ state, onUpdate }) => {
  const chartData = [
    { subject: 'Academic', A: state.weights.academic },
    { subject: 'Skills', A: state.weights.skill },
    { subject: 'Efficiency', A: state.weights.efficiency },
    { subject: 'Well-being', A: state.weights.wellbeing },
  ];

  const handleToggleResponsibility = (id: string) => {
    const updated = state.responsibilities.map(r => 
      r.id === id ? { ...r, active: !r.active } : r
    );
    onUpdate({ ...state, responsibilities: updated });
  };

  const handleWeightChange = (key: keyof typeof state.weights, val: string) => {
    const num = Math.min(100, Math.max(0, parseInt(val) || 0));
    onUpdate({ ...state, weights: { ...state.weights, [key]: num } });
  };

  // Fixed error: Operator '>' cannot be applied to types 'unknown' and 'number'.
  // We cast the value to number to allow comparison.
  const isConfigured = Object.values(state.weights).some(v => (v as number) > 0);

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom duration-700 pb-20">
      <header>
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Heuristic Substrate</h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Weighting the Cost Function Distribution</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="frosted-obsidian p-10 rounded-[3rem] border border-white/5 space-y-10">
          <div className="grid grid-cols-2 gap-8">
            {[
              { id: 'academic', label: 'Academic Impact', icon: Scale },
              { id: 'skill', label: 'Skill Set Growth', icon: Zap },
              { id: 'efficiency', label: 'Execution Ratio', icon: Activity },
              { id: 'wellbeing', label: 'Well-being Reserve', icon: Heart },
            ].map((p) => (
              <div key={p.id} className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                   <p.icon size={12} className="text-violet-500" /> {p.label}
                </label>
                <input type="number" step="1" min="0" max="100" value={(state.weights as any)[p.id]} onChange={(e) => handleWeightChange(p.id as any, e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl p-4 font-mono font-black text-xl text-violet-400 outline-none focus:border-violet-500/30 transition-all" />
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8">System Overhead (Environmental Bias)</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.responsibilities.map((res) => (
                  <button key={res.id} onClick={() => handleToggleResponsibility(res.id)} className={`p-6 rounded-2xl border transition-all flex items-center justify-between group ${res.active ? 'bg-violet-600/10 border-violet-500/50 text-white' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}>
                    <div className="flex items-center gap-4">
                       {res.id === 'job' && <Briefcase size={16} />}
                       {res.id === 'club' && <Users size={16} />}
                       {res.id === 'family' && <Heart size={16} />}
                       <span className="text-[10px] font-black uppercase tracking-widest">{res.label}</span>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${res.active ? 'bg-lime-500 shadow-[0_0_8px_rgba(190,242,100,0.5)]' : 'bg-slate-800'}`}></div>
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="frosted-obsidian p-10 rounded-[3rem] border border-white/5 flex flex-col items-center justify-center spider-chart-container relative overflow-hidden">
           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Bias Projection Visualization</h3>
           
           {!isConfigured ? (
             <div className="flex flex-col items-center justify-center gap-4 opacity-20">
                <Info size={64} className="text-slate-500" />
                <p className="text-[10px] font-black uppercase tracking-widest">Weight Distribution Required</p>
             </div>
           ) : (
             <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="rgba(255,255,255,0.05)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} />
                      <Radar name="Heuristic" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} />
                   </RadarChart>
                </ResponsiveContainer>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default PriorityConfig;
