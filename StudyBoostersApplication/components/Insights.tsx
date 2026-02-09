
import React, { useState } from 'react';
import { getExamInsights } from '../services/geminiService';

const Insights: React.FC = () => {
  const [syllabusText, setSyllabusText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!syllabusText.trim()) return;
    setLoading(true);
    setResult('');
    const insights = await getExamInsights(syllabusText);
    setResult(insights);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Gemini Intelligence</h2>
        <p className="text-slate-500 text-lg font-medium">AI-powered pattern recognition for end-semester syllabus analysis.</p>
      </div>

      <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl border border-slate-800 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl"></div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Syllabus Input Buffer</label>
          <textarea 
            className="w-full h-48 p-6 rounded-[2rem] border border-slate-800 bg-slate-950 focus:border-indigo-500 outline-none resize-none text-white font-medium leading-relaxed placeholder:text-slate-700"
            placeholder="Paste syllabus modules or specific course topics here for deep analysis..."
            value={syllabusText}
            onChange={(e) => setSyllabusText(e.target.value)}
          />
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading || !syllabusText.trim()}
          className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all disabled:opacity-40 disabled:grayscale shadow-xl shadow-indigo-600/20 active:scale-95 border border-indigo-400/20"
        >
          {loading ? 'COMPUTING PATTERNS...' : 'DECODE HIGH-PROBABILITY TOPICS ✨'}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-in zoom-in-95 duration-500">
          <div className="relative">
             <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full"></div>
             <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute inset-0 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
          </div>
          <div className="text-center">
            <p className="text-white font-black text-lg tracking-tight">AI Analysis in Progress</p>
            <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">Scanning academic curriculum database...</p>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-3xl overflow-auto max-h-[700px] prose prose-invert animate-in slide-in-from-bottom-6 duration-500">
          <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-8 pb-4 border-b border-slate-800/50">Intelligence Output Report</div>
          <div className="whitespace-pre-wrap font-sans leading-relaxed text-slate-300 text-base">
             {result}
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-xl mb-4">⚙️</div>
            <h4 className="font-black text-white mb-2 uppercase tracking-widest text-xs">Neural Mapping</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Gemini identifies structural curriculum hubs that traditionally command the highest mark weightage in semester exams.</p>
          </div>
          <div className="p-8 bg-slate-900/40 border border-slate-800 rounded-[2.5rem] hover:border-purple-500/30 transition-all">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-xl mb-4">🛡️</div>
            <h4 className="font-black text-white mb-2 uppercase tracking-widest text-xs">Safe Pass Protocol</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">While AI predicts the 'High Probability' zones, the protocol recommends reviewing core concepts across the entire syllabus for grade stability.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
