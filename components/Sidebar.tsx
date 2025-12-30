import React from 'react';
import { ViewType } from '../types';
import Logo from './Logo';
import { LayoutDashboard, Network, Zap, BookOpen, Settings, LucideIcon } from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  customMenus: { id: string, label: string, icon: LucideIcon }[];
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, customMenus }) => {
  const coreMenus = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'knowledge-graph', label: 'STRUCTURAL MAP', icon: Network },
    { id: 'optimizer', label: 'OPTIMIZER CORE', icon: Zap },
    { id: 'ai-tutor', label: 'ANALYSIS ENGINE', icon: BookOpen },
  ];

  return (
    <aside className="w-20 lg:w-72 h-full flex flex-col p-4 z-40">
      <div className="frosted-obsidian h-full rounded-[2rem] flex flex-col p-6 border border-white/5">
        <div className="flex flex-col items-center lg:items-start gap-4 mb-16 px-2">
          <div className="w-14 h-14 rounded-lg flex items-center justify-center transition-all hover:brightness-125 cursor-pointer">
            <Logo size={52} />
          </div>
          <div className="hidden lg:block mt-2">
            <h1 className="text-xl font-black tracking-tighter text-white">TOPTIMIZER</h1>
            <p className="text-[9px] font-black text-[#7117EA] uppercase tracking-widest leading-tight">V1.0 Architecture</p>
          </div>
        </div>

        <nav className="flex-1 space-y-4">
          <div className="space-y-1">
             <label className="hidden lg:block text-[8px] font-black text-slate-700 uppercase tracking-[0.3em] mb-4 ml-4">Clusters</label>
             {coreMenus.map((item) => (
               <button
                 key={item.id}
                 onClick={() => onViewChange(item.id as ViewType)}
                 className={`w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 rounded-xl transition-all relative group ${
                   currentView === item.id 
                     ? 'bg-white/5 text-white' 
                     : 'text-slate-600 hover:text-slate-200'
                 }`}
               >
                 {currentView === item.id && (
                   <div className="absolute left-0 w-1 h-5 bg-[#7117EA] rounded-full"></div>
                 )}
                 <item.icon size={20} className={currentView === item.id ? 'text-[#7117EA]' : ''} />
                 <span className="hidden lg:block font-black text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
               </button>
             ))}
          </div>

          <div className="pt-8 space-y-1">
             <label className="hidden lg:block text-[8px] font-black text-slate-700 uppercase tracking-[0.3em] mb-4 ml-4">System</label>
             {customMenus.map((item) => (
               <button
                 key={item.id}
                 onClick={() => onViewChange(item.id as ViewType)}
                 className={`w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-3 rounded-xl transition-all relative group ${
                   currentView === item.id 
                     ? 'bg-white/5 text-white' 
                     : 'text-slate-600 hover:text-slate-200'
                 }`}
               >
                 <item.icon size={18} className={currentView === item.id ? 'text-[#7117EA]' : ''} />
                 <span className="hidden lg:block font-black text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
               </button>
             ))}
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 py-4 text-slate-700 hover:text-[#7117EA] transition-colors">
            <Settings size={20} />
            <span className="hidden lg:block font-black text-[10px] uppercase tracking-[0.2em]">CONFIGURATION</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;