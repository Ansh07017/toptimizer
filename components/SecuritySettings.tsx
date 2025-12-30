
import React from 'react';
import { ShieldCheck, Fingerprint, Key, Eye, Lock, ShieldAlert } from 'lucide-react';
import { GlobalState } from '../types';

interface SecurityProps {
  state: GlobalState;
  onUpdate: (newState: GlobalState) => void;
}

const SecuritySettings: React.FC<SecurityProps> = ({ state, onUpdate }) => {
  const toggle = (key: keyof typeof state.security) => {
    onUpdate({
      ...state,
      security: { ...state.security, [key]: !state.security[key] }
    });
  };

  const generateKey = () => {
    const newKey = Math.random().toString(36).substring(2, 10).toUpperCase();
    onUpdate({
      ...state,
      security: { ...state.security, parentalAccessKey: newKey }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex items-center gap-6">
        <div className="p-4 bg-indigo-600 text-white rounded-[1.5rem] shadow-xl shadow-indigo-500/20">
           <ShieldCheck size={32} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Security & Access</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px] mt-1">Data Sovereignty & Encryption Standards</p>
        </div>
      </header>

      <div className="grid gap-8">
        {/* Section 1: Auth */}
        <div className="frosted-obsidian p-10 rounded-[3rem] border border-white/5">
           <h3 className="text-xs font-black uppercase tracking-widest text-violet-400 mb-8 flex items-center gap-3">
              <Fingerprint size={16} /> Authentication Layer
           </h3>
           <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                 <div className="flex items-center gap-4">
                    <Fingerprint className="text-slate-500" size={24} />
                    <div>
                       <p className="text-sm font-black text-white">Biometric Login</p>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">FaceID / TouchID Integration</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => toggle('biometrics')}
                   className={`w-14 h-8 rounded-full transition-all relative ${state.security.biometrics ? 'bg-lime-500' : 'bg-slate-800'}`}
                 >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${state.security.biometrics ? 'left-7' : 'left-1'}`}></div>
                 </button>
              </div>

              <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <Key className="text-slate-500" size={24} />
                       <div>
                          <p className="text-sm font-black text-white">Parental Access Key</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">One-time encrypted tunnel</p>
                       </div>
                    </div>
                    <button 
                      onClick={generateKey}
                      className="px-6 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-violet-500 hover:text-white transition-all"
                    >
                       Regenerate
                    </button>
                 </div>
                 <div className="bg-black/40 rounded-xl p-4 text-center font-mono text-2xl font-black text-violet-400 tracking-[0.5em] border border-white/5">
                    {state.security.parentalAccessKey}
                 </div>
              </div>
           </div>
        </div>

        {/* Section 2: Permissions */}
        <div className="frosted-obsidian p-10 rounded-[3rem] border border-white/5">
           <h3 className="text-xs font-black uppercase tracking-widest text-violet-400 mb-8 flex items-center gap-3">
              <Eye size={16} /> Granular Transparency
           </h3>
           <div className="space-y-4">
              {[
                { id: 'allowParentReports', label: 'Allow parent to view Weekly Reports' },
                { id: 'allowParentLoad', label: 'Allow parent to view Cognitive Load' },
                { id: 'allowParentNotes', label: 'Allow parent to view Task Notes', warning: true },
              ].map((perm) => (
                <div key={perm.id} className="flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-all">
                   <div className="flex items-center gap-4">
                      {perm.warning && <ShieldAlert size={14} className="text-rose-500" />}
                      <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{perm.label}</span>
                   </div>
                   <button 
                     onClick={() => toggle(perm.id as any)}
                     className={`w-10 h-6 rounded-full transition-all relative ${state.security[perm.id as keyof typeof state.security] ? 'bg-violet-500' : 'bg-slate-800'}`}
                   >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${(state.security as any)[perm.id] ? 'left-5' : 'left-1'}`}></div>
                   </button>
                </div>
              ))}
           </div>
        </div>

        {/* Section 3: Compliance */}
        <div className="flex items-center justify-center gap-8 py-4 opacity-40">
           <div className="flex items-center gap-2">
              <Lock size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">AES-256 Encrypted</span>
           </div>
           <div className="flex items-center gap-2">
              <ShieldCheck size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">Data Sovereignty Compliant</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
