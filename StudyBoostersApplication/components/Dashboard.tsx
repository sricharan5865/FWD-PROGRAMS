
import React, { useState } from 'react';
import { View, SyllabusItem } from '../types';

interface DashboardProps {
  syllabus: SyllabusItem[];
  onNavigate: (view: View) => void;
  notesCount: number;
  doubtsCount: number;
  rollNumber: string;
  onPromoteToAdmin: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ syllabus, onNavigate, notesCount, doubtsCount, rollNumber, onPromoteToAdmin }) => {
  const completed = syllabus.filter(s => s.completed).length;
  
  const [adminCode, setAdminCode] = useState('');
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [adminError, setAdminError] = useState(false);

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCode === '586522') {
      onPromoteToAdmin();
    } else {
      setAdminError(true);
      setAdminCode('');
      setTimeout(() => setAdminError(false), 2000);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Welcome Card */}
      <section className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 rounded-[4rem] p-12 text-white shadow-2xl relative border border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 p-16 opacity-[0.03] select-none pointer-events-none">
          <span className="text-[12rem] font-black">{rollNumber.charAt(rollNumber.length - 1)}</span>
        </div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-white/10">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              Gateway Secure
            </div>
            <h2 className="text-5xl font-black mb-6 tracking-tighter leading-tight">Welcome back, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{rollNumber}</span></h2>
            <p className="text-slate-400 text-lg mb-10 font-medium leading-relaxed max-w-md">
              Your performance metrics are trending upward. Access your study tools below to maintain momentum.
            </p>
            <div className="flex flex-wrap gap-5">
              <button 
                onClick={() => onNavigate('Browse')}
                className="bg-white text-slate-950 px-10 py-4.5 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/5"
              >
                Access Repository
              </button>
              <button 
                onClick={() => onNavigate('Doubts')}
                className="bg-slate-800/50 backdrop-blur-md text-white px-10 py-4.5 rounded-2xl font-black text-sm hover:bg-slate-700 transition-all border border-white/10"
              >
                Open Doubt Hub
              </button>
            </div>
          </div>

          <div className="bg-slate-950/40 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/10">
             <div className="mb-10 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Indexing</span>
                <span className="text-[10px] font-bold text-indigo-400">UPDATING LIVE</span>
             </div>
             <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all group">
                   <p className="text-5xl font-black mb-2 text-white group-hover:scale-110 transition-transform">{notesCount}</p>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Curated Files</p>
                </div>
                <div className="text-center p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all group">
                   <p className="text-5xl font-black mb-2 text-white group-hover:scale-110 transition-transform">{doubtsCount}</p>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Open Queries</p>
                </div>
             </div>
             <div className="mt-8 flex items-center justify-center gap-3 py-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Campus Study Feed Synced</span>
             </div>
          </div>
        </div>
      </section>

      {/* Navigation Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div 
           onClick={() => onNavigate('Tracker')}
           className="bg-slate-900/50 backdrop-blur-sm p-10 rounded-[3rem] border border-slate-800 shadow-xl hover:border-indigo-500/50 transition-all cursor-pointer group"
         >
            <div className="w-16 h-16 bg-indigo-500/10 rounded-[1.5rem] flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform group-hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]">📅</div>
            <h3 className="text-2xl font-black text-white mb-3">Academic Tracker</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Precision-based syllabus management with priority tagging and visual progress indicators.</p>
         </div>

         <div 
           onClick={() => onNavigate('Insights')}
           className="bg-slate-900/50 backdrop-blur-sm p-10 rounded-[3rem] border border-slate-800 shadow-xl hover:border-purple-500/50 transition-all cursor-pointer group"
         >
            <div className="w-16 h-16 bg-purple-500/10 rounded-[1.5rem] flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform group-hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]">🧠</div>
            <h3 className="text-2xl font-black text-white mb-3">AI Predications</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Leverage the Gemini intelligence layer to decode exam patterns and prioritize high-yield topics.</p>
         </div>
      </div>

      {/* Admin Entrance */}
      <div className="pt-20">
        <div className="bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[4rem] p-16 text-center">
          {!showAdminPortal ? (
            <div className="max-w-sm mx-auto">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-800 text-slate-400 text-2xl shadow-inner">
                🔒
              </div>
              <h4 className="text-2xl font-black text-white mb-3">Campus Admin Gateway</h4>
              <p className="text-slate-500 text-sm mb-10 font-medium">Moderation tools and core system settings are restricted to authorized administrators.</p>
              <button 
                onClick={() => setShowAdminPortal(true)}
                className="bg-slate-100 text-slate-950 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-white/5 active:scale-95"
              >
                Access Secure Portal
              </button>
            </div>
          ) : (
            <div className={`max-w-xs mx-auto animate-in fade-in zoom-in duration-300 ${adminError ? 'animate-shake' : ''}`}>
               <form onSubmit={handleAdminVerify} className="space-y-8">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Security Identification</p>
                    <div className="flex justify-center gap-3 mb-8">
                      <input 
                        type="password" 
                        placeholder="••••••"
                        maxLength={6}
                        autoFocus
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                        className={`w-full text-center text-4xl font-black tracking-[0.4em] p-6 rounded-[2rem] border-2 transition-all outline-none bg-slate-950 ${
                          adminError ? 'border-red-500/50 text-red-500 ring-4 ring-red-500/10' : 'border-slate-800 focus:border-indigo-500 text-white'
                        }`}
                      />
                    </div>
                    {adminError && <p className="text-xs font-black text-red-400 uppercase mb-6 tracking-widest">Pin Incorrect</p>}
                    <div className="flex gap-4">
                      <button 
                        type="button"
                        onClick={() => {setShowAdminPortal(false); setAdminCode('');}}
                        className="flex-1 py-4.5 bg-slate-800 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="flex-[2] py-4.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all active:scale-95"
                      >
                        Verify Identity
                      </button>
                    </div>
                  </div>
               </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
