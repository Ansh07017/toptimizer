
import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Download, Mail, Share2, TrendingUp, CheckCircle2 } from 'lucide-react';

const data = [
  { name: 'Mon', cost: 45, output: 60 },
  { name: 'Tue', cost: 78, output: 65 },
  { name: 'Wed', cost: 90, output: 85 },
  { name: 'Thu', cost: 65, output: 95 },
  { name: 'Fri', cost: 30, output: 80 },
  { name: 'Sat', cost: 20, output: 40 },
  { name: 'Sun', cost: 15, output: 30 },
];

const Reports: React.FC = () => {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 className="text-5xl font-black text-white tracking-tighter uppercase">Weekly Efficiency Report</h2>
           <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Evaluation Cycle: MARCH_04 // VERSION_3.1</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <Download size={14} /> Export PDF
           </button>
           <button className="px-6 py-3 bg-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-700 transition-all flex items-center gap-2">
              <Mail size={14} /> Sync Log
           </button>
        </div>
      </header>

      <div className="frosted-obsidian p-10 rounded-[3.5rem] border border-white/5">
         <div className="flex justify-between items-center mb-10">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-violet-400 flex items-center gap-3">
               <TrendingUp size={16} /> Progress Over Time: Cost vs. Output
            </h3>
            <div className="flex gap-6">
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"></div><span className="text-[9px] font-black text-slate-500 uppercase">Load Cost</span></div>
               <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-lime-500"></div><span className="text-[9px] font-black text-slate-500 uppercase">Efficiency</span></div>
            </div>
         </div>
         <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data}>
                  <defs>
                     <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#bef264" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#bef264" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} fontWeight={800} axisLine={false} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} fontWeight={800} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '12px' }} itemStyle={{ fontWeight: '800' }} />
                  <Area type="monotone" dataKey="cost" stroke="#f43f5e" fillOpacity={1} fill="url(#colorCost)" strokeWidth={2} />
                  <Area type="monotone" dataKey="output" stroke="#bef264" fillOpacity={1} fill="url(#colorOutput)" strokeWidth={2} />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 frosted-obsidian p-12 rounded-[3.5rem] border border-white/5 flex flex-col justify-center">
            <div className="flex items-start gap-8">
               <div className="p-6 bg-lime-500/10 text-lime-500 rounded-3xl border border-lime-500/20">
                  <CheckCircle2 size={40} />
               </div>
               <div className="space-y-4">
                  <h4 className="text-2xl font-black text-white tracking-tight uppercase leading-tight">Session Summary Analysis</h4>
                  <p className="text-slate-400 text-lg leading-relaxed font-medium">
                     Current cycle optimization resulted in <span className="text-lime-400 font-black">42 hours</span> of verified throughput. System successfully mitigated <span className="text-rose-400 font-black">3 burnout vectors</span> through dynamic re-weighting.
                  </p>
               </div>
            </div>
         </div>

         <div className="frosted-obsidian p-10 rounded-[3.5rem] border border-white/5 flex flex-col items-center justify-center text-center space-y-8">
            <div className="w-20 h-20 bg-violet-600/10 rounded-full flex items-center justify-center border border-violet-500/20">
               <Share2 size={24} className="text-violet-400" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Metrics Distribution</p>
               <h4 className="text-xl font-black text-white uppercase tracking-tight">Tier Consistency Alpha</h4>
            </div>
            <button className="w-full py-4 bg-white/5 text-slate-400 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all">
               System Share
            </button>
         </div>
      </div>
    </div>
  );
};

export default Reports;
