
import React from 'react';
import { SyllabusItem } from '../types';

interface TrackerProps {
  syllabus: SyllabusItem[];
  onToggle: (id: string) => void;
}

const Tracker: React.FC<TrackerProps> = ({ syllabus, onToggle }) => {
  const subjects = Array.from(new Set(syllabus.map(s => s.subject)));

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Syllabus Matrix</h2>
          <p className="text-slate-500 text-lg font-medium mt-2">Precision tracking for high-performance revision cycles.</p>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-5xl font-black text-indigo-400 tracking-tighter">
            {syllabus.filter(s => s.completed).length}<span className="text-slate-700 text-2xl mx-1">/</span>{syllabus.length}
          </div>
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-2">Curriculum Depth</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {subjects.map(subject => {
          const subjectItems = syllabus.filter(s => s.subject === subject);
          const completedCount = subjectItems.filter(s => s.completed).length;
          const percent = Math.round((completedCount / subjectItems.length) * 100);

          return (
            <div key={subject} className="bg-slate-900/50 backdrop-blur-sm rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl">
              <div className="bg-slate-900/80 p-10 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">{subject}</h3>
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mt-1">Operational Module Hub</p>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-right">
                      <span className="text-2xl font-black text-white">{percent}%</span>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Mastery</p>
                   </div>
                   <div className="w-32 bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                      <div className="bg-indigo-600 h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(99,102,241,0.4)]" style={{ width: `${percent}%` }}></div>
                   </div>
                </div>
              </div>
              
              <div className="divide-y divide-slate-800">
                {subjectItems.map(item => (
                  <div 
                    key={item.id} 
                    className={`p-6 flex items-center justify-between hover:bg-slate-950/50 transition-all cursor-pointer group`}
                    onClick={() => onToggle(item.id)}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                        item.completed ? 'bg-indigo-600 border-indigo-600 shadow-[0_0_12px_rgba(99,102,241,0.3)]' : 'border-slate-800 bg-slate-950 group-hover:border-indigo-500/50'
                      }`}>
                        {item.completed && <span className="text-white text-base">✓</span>}
                      </div>
                      <div>
                        <span className={`text-base font-bold transition-all ${item.completed ? 'text-slate-600 line-through' : 'text-slate-200 group-hover:text-white'}`}>
                          {item.moduleName}
                        </span>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                      item.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                      item.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                      'bg-slate-950 text-slate-600 border-slate-800'
                    }`}>
                      {item.priority} PKG
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tracker;
