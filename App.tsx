import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PriorityConfig from './components/PriorityConfig';
import SecuritySettings from './components/SecuritySettings';
import KnowledgeGraph from './components/KnowledgeGraph';
import Reports from './components/Reports';
import TaskEntryModal from './components/TaskEntryModal';
import SyllabusProcessor from './components/SyllabusProcessor';
import Auth from './components/Auth';
import Logo from './components/Logo';
import { ViewType, Node, OptimizedPath, GlobalState, SystemNotification, User } from './types';
import { getOptimizationPath, getTutorExplanation } from './services/geminiService';
import { Bell, Loader2, Sparkles, BrainCircuit, Terminal, Shield, BarChart3, Plus, FileUp, X, LogOut } from 'lucide-react';

const STORAGE_KEY = 'toptimizer_data_v1';

const EMPTY_STATE: GlobalState = {
  user: null,
  isAuthenticated: false,
  weights: { academic: 0, skill: 0, efficiency: 0, wellbeing: 0 },
  responsibilities: [
    { id: 'job', label: 'Part-time Employment', active: false, weightPenalty: 15 },
    { id: 'club', label: 'Student Organization', active: false, weightPenalty: 10 },
    { id: 'family', label: 'Domestic Responsibilities', active: false, weightPenalty: 20 },
  ],
  security: {
    biometrics: true,
    parentalAccessKey: 'NULL-00',
    allowParentReports: false,
    allowParentLoad: false,
    allowParentNotes: false,
  },
  mentalBattery: 100,
  tasks: [],
  notifications: [
    { id: 'init', timestamp: Date.now(), message: 'Toptimizer system substrate initialized.', type: 'info' }
  ]
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType | 'syllabus-sync'>('dashboard');
  const [state, setState] = useState<GlobalState>(EMPTY_STATE);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedPath, setOptimizedPath] = useState<OptimizedPath | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isTutoring, setIsTutoring] = useState(false);
  const [links, setLinks] = useState<any[]>([]);

  const [optimizationGoal, setOptimizationGoal] = useState('');
  const [availableTime, setAvailableTime] = useState('2 Hours');

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.isAuthenticated) {
        setState(parsed);
      }
    }
  }, []);

  useEffect(() => {
    if (state.isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const handleLogin = (user: User, isNewUser: boolean) => {
    if (isNewUser) {
      setState({ ...EMPTY_STATE, user, isAuthenticated: true });
    } else {
      setState(prev => ({ ...prev, user, isAuthenticated: true }));
    }
    addNotification(`Authentication sequence complete. Interface ready.`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(EMPTY_STATE);
    setCurrentView('dashboard');
  };

  const addNotification = (message: string, type: SystemNotification['type'] = 'info') => {
    const newNotif: SystemNotification = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      message,
      type
    };
    setState(prev => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications].slice(0, 20)
    }));
  };

  const handleTaskAnalysis = async (node: Node) => {
    setIsTutoring(true);
    setCurrentView('ai-tutor');
    try {
      const result = await getTutorExplanation(node.label);
      setExplanation(result);
      addNotification(`Deep analysis complete: ${node.label}`, 'success');
    } catch (e) {
      addNotification('Neural framework error.', 'alert');
    } finally {
      setIsTutoring(false);
    }
  };

  const handlePathwayGenerated = (nodes: Node[], newLinks: any[]) => {
    setState(prev => ({ ...prev, tasks: [...prev.tasks, ...nodes] }));
    setLinks(prev => [...prev, ...newLinks]);
    addNotification(`Syllabus ingestion successful. Mapping updated.`, 'success');
    setCurrentView('knowledge-graph');
  };

  const handleAddTask = (taskData: { label: string; type: 'subject' | 'topic' | 'task'; hours: number; days: string[] }) => {
    const newNode: Node = {
      id: `task-${Date.now()}`,
      label: taskData.label,
      type: taskData.type,
      status: 'pending',
      difficulty: 5,
      cognitiveLoad: taskData.hours * 12,
      importance: 1.0
    };
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newNode] }));
    addNotification(`Task module synchronized: ${taskData.label}`, 'info');
    setIsTaskModalOpen(false);
  };

  const triggerOptimization = async (goal: string, time: string) => {
     if (state.tasks.length === 0) {
       addNotification('Substrate empty. Optimization requires modules.', 'alert');
       return;
     }
     setIsOptimizing(true);
     try {
        const path = await getOptimizationPath({ nodes: state.tasks, links }, goal, time, state.weights);
        setOptimizedPath(path);
        addNotification(`Traversal path calculated successfully.`, 'success');
     } catch (e) { 
        addNotification('Optimization process failure.', 'alert');
     } finally { setIsOptimizing(false); }
  };

  if (!state.isAuthenticated) {
    return <Auth onAuthSuccess={handleLogin} />;
  }

  return (
    <div className="flex bg-[#020617] h-screen text-slate-100 flex-col overflow-hidden font-inter selection:bg-[#7117EA]/30">
      <TaskEntryModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} onAddTask={handleAddTask} />

      {isNotifOpen && (
        <div className="fixed top-16 right-8 w-80 max-h-[400px] frosted-obsidian border border-white/10 rounded-[1rem] z-[100] p-6 flex flex-col animate-in slide-in-from-top-4 duration-300">
           <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Activity Log</h4>
              <button onClick={() => setIsNotifOpen(false)} className="text-slate-500 hover:text-white"><X size={14}/></button>
           </div>
           <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
              {state.notifications.map(n => (
                <div key={n.id} className="p-3 bg-white/5 rounded-lg border border-white/5">
                   <p className={`text-[8px] font-bold uppercase tracking-widest mb-1 ${n.type === 'alert' ? 'text-rose-500' : n.type === 'success' ? 'text-lime-500' : 'text-[#7117EA]'}`}>
                      {n.type} // {new Date(n.timestamp).toLocaleTimeString()}
                   </p>
                   <p className="text-[10px] font-medium text-slate-400 leading-snug">{n.message}</p>
                </div>
              ))}
           </div>
        </div>
      )}

      <div className="h-10 bg-black/80 flex items-center px-6 justify-between border-b border-white/5 shrink-0 z-50 backdrop-blur-xl">
        <div className="flex gap-2.5 items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
          <span className="ml-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">Interface: Active</span>
        </div>
        <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] flex items-center gap-2">
          <Logo size={14} />
          TOPTIMIZER_SYSTEM
        </div>
        <div className="flex items-center gap-6 text-[9px] font-black text-slate-600">
            <button onClick={handleLogout} className="flex items-center gap-2 hover:text-[#7117EA] transition-colors uppercase tracking-widest">
              <LogOut size={12}/> Disconnect
            </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
           currentView={currentView as any} 
           onViewChange={setCurrentView as any} 
           customMenus={[
             { id: 'priority-config', label: 'PRIORITIES', icon: Terminal },
             { id: 'security', label: 'SECURITY', icon: Shield },
             { id: 'reports', label: 'REPORTS', icon: BarChart3 }
           ]}
        />
        
        <main className="flex-1 p-8 lg:p-12 overflow-y-auto relative custom-scrollbar z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
            <div className="flex items-center gap-6">
                <button onClick={() => setIsTaskModalOpen(true)} className="bg-[#7117EA] px-8 py-3 rounded-lg text-white font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-3">
                  <Plus size={16} /> New Module
                </button>
                <button onClick={() => setCurrentView('syllabus-sync')} className={`flex items-center gap-4 px-8 py-3 rounded-lg border transition-all font-black text-[10px] uppercase tracking-widest ${currentView === 'syllabus-sync' ? 'bg-[#7117EA] text-white border-[#7117EA]' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'}`}>
                   <FileUp size={16} /> Syllabus Sync
                </button>
            </div>
            
            <div className="flex items-center gap-8">
                <button onClick={() => setIsNotifOpen(!isNotifOpen)} className={`p-4 bg-white/5 rounded-lg border transition-all relative ${isNotifOpen ? 'border-[#7117EA] text-[#7117EA]' : 'border-white/5 text-slate-500'}`}>
                  <Bell size={18} />
                  {state.notifications.length > 0 && <div className="absolute top-3 right-3 w-1 h-1 rounded-full bg-rose-500"></div>}
                </button>
                
                <div className="flex items-center gap-6 pl-8 border-l border-white/10">
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{state.user?.username}</p>
                        <p className="text-[8px] font-black text-[#7117EA] uppercase tracking-[0.4em]">Efficiency: Tier Alpha</p>
                    </div>
                    <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                       <Logo size={32} />
                    </div>
                </div>
            </div>
          </div>

          {currentView === 'dashboard' && <Dashboard state={state} onTaskAction={handleTaskAnalysis} addNotification={addNotification} />}
          {currentView === 'knowledge-graph' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 h-[calc(100vh-320px)]">
              <div className="lg:col-span-3 flex flex-col gap-6">
                 <KnowledgeGraph data={{ nodes: state.tasks, links }} onNodeClick={setSelectedNode} />
              </div>
              <div className="frosted-obsidian p-10 rounded-[2rem] border border-white/5 flex flex-col">
                 <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-12 pb-6 border-b border-white/5">Inspector</h3>
                 {selectedNode ? (
                    <div className="space-y-10 animate-in slide-in-from-right duration-500">
                       <div>
                          <label className="text-[9px] font-black text-[#7117EA] uppercase tracking-widest">Module ID</label>
                          <p className="text-3xl font-black text-white tracking-tighter uppercase mt-2">{selectedNode.label}</p>
                       </div>
                       <div className="space-y-4">
                          <div className="flex justify-between items-end">
                             <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Cognitive Load</label>
                             <span className="text-xs font-mono font-black text-lime-500">{selectedNode.cognitiveLoad}%</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                             <div className="h-full bg-[#7117EA]" style={{ width: `${selectedNode.cognitiveLoad}%` }}></div>
                          </div>
                       </div>
                       <button onClick={() => handleTaskAnalysis(selectedNode)} className="w-full py-5 bg-white text-black rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-[#7117EA] hover:text-white transition-all flex items-center justify-center gap-4">
                          <BrainCircuit size={18} /> Deep Synthesis
                       </button>
                    </div>
                 ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-10 text-center">
                       <Logo size={80} className="mb-6 opacity-30" />
                       <p className="text-[10px] font-black uppercase tracking-[0.4em]">Select Node</p>
                    </div>
                 )}
              </div>
            </div>
          )}
          {currentView === 'priority-config' && <PriorityConfig state={state} onUpdate={setState} />}
          {currentView === 'security' && <SecuritySettings state={state} onUpdate={setState} />}
          {currentView === 'reports' && <Reports />}
          {currentView === 'syllabus-sync' && <SyllabusProcessor onPathwayGenerated={handlePathwayGenerated} />}
          {currentView === 'optimizer' && (
            <div className="max-w-4xl mx-auto space-y-12">
               <div className="frosted-obsidian p-12 rounded-[2.5rem] border border-white/5">
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-12">Optimization Engine</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                     <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target Objective</label>
                        <input type="text" placeholder="e.g. EXAM_MASTERY" className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-lg font-black text-[#7117EA] outline-none focus:border-[#7117EA]/30" value={optimizationGoal} onChange={(e) => setOptimizationGoal(e.target.value)} />
                     </div>
                     <div className="space-y-6">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Window</label>
                        <select className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-lg font-black text-[#7117EA] outline-none" value={availableTime} onChange={(e) => setAvailableTime(e.target.value)}>
                           <option>2 Hours</option>
                           <option>4 Hours</option>
                           <option>8 Hours</option>
                        </select>
                     </div>
                  </div>
                  <button onClick={() => triggerOptimization(optimizationGoal, availableTime)} disabled={isOptimizing} className="w-full py-8 bg-[#7117EA] text-white rounded-xl font-black text-xl uppercase tracking-[0.2em] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-6 disabled:opacity-20">
                     {isOptimizing ? <Loader2 className="animate-spin" /> : <Sparkles />}
                     {isOptimizing ? 'Computing Traversal...' : 'Initialize Calculations'}
                  </button>
               </div>
               {optimizedPath && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in zoom-in duration-500">
                     <div className="lg:col-span-2 frosted-obsidian p-12 rounded-[2rem] border border-white/5 space-y-10">
                        <h3 className="text-xl font-black flex items-center gap-4"><Terminal size={24} className="text-[#7117EA]" /> RESULTS_LOG</h3>
                        {optimizedPath.steps.map((s, i) => (
                           <div key={i} className="flex gap-6 items-start">
                              <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black text-sm rounded-lg">{i+1}</div>
                              <p className="text-xl font-black text-white uppercase mt-1">{s}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
          )}
          {currentView === 'ai-tutor' && (
            <div className="max-w-4xl mx-auto">
               {isTutoring && (
                 <div className="flex flex-col items-center justify-center py-20 gap-6">
                   <Loader2 className="animate-spin text-[#7117EA]" size={48} />
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Synchronizing Neural Architecture...</p>
                 </div>
               )}
               {explanation && !isTutoring && (
                  <div className="frosted-obsidian p-16 rounded-[2.5rem] border border-white/5 animate-in slide-in-from-bottom duration-700">
                     <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-10 italic">System Synthesis</h2>
                     <div className="prose prose-invert max-w-none text-xl text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">{explanation}</div>
                     <button onClick={() => setExplanation(null)} className="mt-12 w-full py-6 bg-white/5 text-slate-500 rounded-xl font-black uppercase tracking-[0.2em] hover:text-white transition-all text-[10px]">Flush Buffer</button>
                  </div>
               )}
            </div>
          )}
        </main>

        <div className="absolute bottom-0 left-0 w-full h-14 bg-black/80 border-t border-white/5 z-50 flex items-center justify-between px-10 backdrop-blur-xl">
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-lime-500"></div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">CORE: OPERATIONAL</span>
              </div>
              <div className="h-4 w-px bg-white/10"></div>
              <div className="flex items-center gap-4">
                 <Logo size={18} />
                 <span className="text-[10px] font-bold text-slate-500/80 italic tracking-tight">Main Theme: #7117EA // Flat Style Active.</span>
              </div>
           </div>
           <div className="flex items-center gap-8 text-[9px] font-black text-slate-700 uppercase tracking-widest font-mono">
              <span className="text-[#7117EA]/50">LATENCY: 0.6ms</span>
              <span>NODE_SYNC_COMPLETE</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;