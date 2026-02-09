
import React from 'react';

interface HeroProps {
  stats: {
    totalFiles: string;
    downloads: string;
    activeUsers: string;
    weeklyUploads: string;
  };
  latestNews?: string;
  onBrowse: () => void;
  onUpload: () => void;
}

const Hero: React.FC<HeroProps> = ({ stats, latestNews, onBrowse, onUpload }) => {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center animate-in fade-in duration-1000">

      {/* Background Grid is handled in index.html body class */}

      {/* Floating Decorative Elements */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden xl:block animate-bounce" style={{ animationDuration: '4s' }}>
        <div className="w-14 h-16 bg-slate-900/80 rounded-xl border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
      </div>

      <div className="absolute right-10 top-3/4 -translate-y-1/2 hidden xl:block animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
        <div className="w-14 h-14 bg-slate-900/80 rounded-xl border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
      </div>

      <div className="max-w-4xl text-center space-y-10 relative z-10">





        {/* Main Headline */}
        <h1 className="text-[56px] md:text-[84px] font-black text-white leading-[1] tracking-tight animate-in slide-in-from-bottom-6 duration-700">
          Share, Discover & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 text-glow">Learn Smarter</span>
        </h1>

        {/* Description */}
        <p className="max-w-xl mx-auto text-slate-400 text-lg md:text-xl font-medium leading-relaxed opacity-80 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          A centralized platform where students upload and access study materials, managed securely by an admin. Your academic success starts here.
        </p>

        {latestNews && (
          <div className="w-full max-w-2xl mx-auto mb-8 overflow-hidden bg-slate-900/50 border border-indigo-500/30 rounded-full py-2 px-4 backdrop-blur-md">
            <div className="whitespace-nowrap animate-marquee inline-block">
              <span className="text-indigo-300 text-sm font-semibold tracking-wide mr-8">📢 UPDATE: {latestNews}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <button
            onClick={onBrowse}
            className="w-full sm:w-auto px-8 py-4.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-[0_15px_30px_rgba(99,102,241,0.3)] hover:bg-indigo-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-lg">🔍</span> Browse Materials
          </button>
          <button
            onClick={onUpload}
            className="w-full sm:w-auto px-8 py-4.5 bg-slate-950/40 text-white border border-slate-800 rounded-xl font-bold text-sm hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <span className="text-lg">📤</span> Upload Files
          </button>
        </div>
      </div>

      {/* Subtle Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-600/5 blur-[120px] pointer-events-none"></div>
    </div>
  );
};

export default Hero;
