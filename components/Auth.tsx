import React, { useState } from 'react';
import { Cpu, Shield, MoveRight, User, Mail, Lock, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { User as UserType } from '../types';
import Logo from './Logo';

interface AuthProps {
  onAuthSuccess: (user: UserType, isNewUser: boolean) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const passwordValidation = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[@$!%*?&]/.test(formData.password)
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isLogin && !isPasswordValid) {
      setErrorMsg('Toptimizer requires high-entropy access codes.');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const mockUser: UserType = {
        id: Math.random().toString(36).substr(2, 9),
        username: formData.username || (isLogin ? 'AUTH_NODE_ALPHA' : 'NEW_ENTRY_POINT'),
        email: formData.email
      };
      setLoading(false);
      onAuthSuccess(mockUser, !isLogin);
    }, 1200);
  };

  return (
    <div className="h-screen w-full bg-[#020617] flex items-center justify-center p-8 overflow-hidden font-inter">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 frosted-obsidian rounded-[2.5rem] border border-white/10 overflow-hidden relative z-10">
        
        {/* Branding Cluster */}
        <div className="bg-white/5 p-12 lg:p-16 flex flex-col justify-between border-r border-white/5">
           <div className="space-y-10">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center">
                 <Logo size={80} />
              </div>
              <div className="space-y-4">
                 <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none italic brand-text-gradient">Toptimizer</h1>
                 <p className="text-[#7117EA] font-black uppercase tracking-[0.4em] text-[11px]">Academic Efficiency Engine // #7117EA</p>
              </div>
           </div>

           <div className="space-y-10">
              <div className="flex items-center gap-6 group">
                 <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 text-slate-600 group-hover:text-[#7117EA] transition-colors">
                    <Shield size={18} />
                 </div>
                 <div>
                    <h4 className="text-[9px] font-black text-white uppercase tracking-widest">Sovereign Layer</h4>
                    <p className="text-[8px] text-slate-600 uppercase tracking-widest mt-1">Encrypted Access Substrate</p>
                 </div>
              </div>
              <div className="flex items-center gap-6 group">
                 <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 text-slate-600 group-hover:text-[#7117EA] transition-colors">
                    <Cpu size={18} />
                 </div>
                 <div>
                    <h4 className="text-[9px] font-black text-white uppercase tracking-widest">Calculated Flow</h4>
                    <p className="text-[8px] text-slate-600 uppercase tracking-widest mt-1">Structural Intelligence</p>
                 </div>
              </div>
           </div>

           <div className="pt-8 border-t border-white/5">
              <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">Interface: Initializing Connection</p>
           </div>
        </div>

        {/* Input Layer */}
        <div className="p-12 lg:p-20 flex flex-col justify-center">
           <div className="mb-12">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{isLogin ? 'Initiate Link' : 'Initialize Node'}</h2>
              <p className="text-slate-500 text-sm mt-3 font-medium uppercase tracking-widest leading-relaxed">
                 {isLogin ? 'Access the Toptimizer system core.' : 'Create a fresh system profile.'}
              </p>
           </div>

           {errorMsg && (
             <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-3 text-rose-500">
               <XCircle size={14} />
               <span className="text-[9px] font-black uppercase tracking-widest">{errorMsg}</span>
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-3">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <User size={10} /> Handle
                   </label>
                   <input 
                      type="text" required
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      placeholder="e.g. USER_01"
                      className="w-full bg-black/40 border border-white/5 rounded-lg p-4 text-sm font-bold text-white outline-none focus:border-[#7117EA]/50 transition-all"
                   />
                </div>
              )}
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Mail size={10} /> Address
                 </label>
                 <input 
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="user@toptimizer.node"
                    className="w-full bg-black/40 border border-white/5 rounded-lg p-4 text-sm font-bold text-white outline-none focus:border-[#7117EA]/50 transition-all"
                 />
              </div>
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Lock size={10} /> Key Sequence
                 </label>
                 <input 
                    type="password" required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/5 rounded-lg p-4 text-sm font-bold text-white outline-none focus:border-[#7117EA]/50 transition-all"
                 />
                 
                 {!isLogin && (
                   <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
                      {[
                        { key: 'length', label: '8+ Symbols' },
                        { key: 'uppercase', label: 'Upper Case' },
                        { key: 'number', label: 'Numerical' },
                        { key: 'special', label: 'Specials' }
                      ].map((req) => (
                        <div key={req.key} className={`flex items-center gap-2 text-[8px] font-black uppercase tracking-widest transition-colors ${(passwordValidation as any)[req.key] ? 'text-lime-500' : 'text-slate-700'}`}>
                           <CheckCircle2 size={10} />
                           {req.label}
                        </div>
                      ))}
                   </div>
                 )}
              </div>

              <button 
                type="submit" disabled={loading}
                className="w-full py-6 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#7117EA] hover:text-white transition-all flex items-center justify-center gap-6 disabled:opacity-50"
              >
                 {loading ? <Loader2 className="animate-spin" /> : isLogin ? 'Establish Link' : 'Initialize Interface'}
                 {!loading && <MoveRight size={18} />}
              </button>
           </form>

           <div className="mt-12 text-center">
              <button 
                onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}
                className="text-[9px] font-black text-slate-600 hover:text-[#7117EA] uppercase tracking-[0.2em] transition-colors"
              >
                 {isLogin ? 'NEW_ACCOUNT // INITIALIZE' : 'EXISTING_NODE // ACCESS'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;