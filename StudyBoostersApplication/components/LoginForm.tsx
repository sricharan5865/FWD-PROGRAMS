
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (roll: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [roll, setRoll] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation: Allow strict 10-digit number starting with 25200 OR 'ADMIN' override
    const isValidLength = /^\d{10}$/.test(roll);
    const isAdmin = roll.toUpperCase().includes('ADMIN');

    if (!isAdmin) {
      if (!isValidLength) {
        setError('Access Denied: Roll Number must be exactly 10 digits.');
        return;
      }
      if (!roll.startsWith('25200')) {
        setError('Access Denied: Invalid Roll Number.'); // Prefix requirement hidden as requested
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      onLogin(roll);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden flex-col">
      {/* Modern Neon Background Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[2rem] shadow-[0_0_40px_rgba(99,102,241,0.4)] mb-8 transition-transform hover:scale-110">
            <span className="text-white text-4xl font-black">B</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Virtual Sharing for Better Learning</h1>
          <p className="text-slate-400 font-medium text-lg leading-relaxed">The OS for high-performance students.</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-2xl p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <h2 className="text-2xl font-black text-white">System Access</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label htmlFor="roll" className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1">
                  University Credential
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                    <span className="text-lg opacity-40">👤</span>
                  </div>
                  <input
                    id="roll"
                    type="text"
                    autoFocus
                    placeholder="e.g. 2520090137"
                    className={`w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-950 border transition-all outline-none font-bold text-white placeholder:text-slate-700 ${error ? 'border-red-500/50 ring-4 ring-red-500/10' : 'border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                      }`}
                    value={roll}
                    onChange={(e) => {
                      setRoll(e.target.value);
                      if (error) setError('');
                    }}
                    required
                  />
                </div>
                {error && <p className="mt-2 text-xs font-bold text-red-400 px-1 animate-in slide-in-from-left-2">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || !roll}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-2xl font-black text-lg shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-indigo-500/50 active:scale-[0.97] transition-all disabled:opacity-40 disabled:grayscale flex items-center justify-center gap-3 border border-indigo-400/20"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Connect Gateway <span className="text-xl">→</span></>
                )}
              </button>
            </form>

            <div className="pt-8 border-t border-slate-800 text-center">
              <div className="bg-indigo-500/5 rounded-2xl p-5 border border-indigo-500/10">
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mb-2">MVP Phase active</p>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Curated notes, exam predictions, and real-time mentor support.
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
        </div>

        <p className="mt-12 text-center text-slate-600 text-xs font-bold uppercase tracking-widest">
          Engineered for academic efficiency.
        </p>
      </div>
    </div>
  );
};

export default Login;
