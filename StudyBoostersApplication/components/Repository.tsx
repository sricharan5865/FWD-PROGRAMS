
import React, { useState, useMemo } from 'react';
import { StudyFile, UserRole, Subject } from '../types';

interface RepositoryProps {
  files: StudyFile[];
  subjects: Subject[];
  userRole: UserRole;
  userRoll: string;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}

const Repository: React.FC<RepositoryProps> = ({ files, subjects, userRole, userRoll, onDelete, onDownload }) => {
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');

  const filteredFiles = useMemo(() => {
    return files.filter(f => {
      const canSee = f.status === 'Approved' || f.uploader === userRoll || userRole === 'Admin';
      if (!canSee) return false;

      const searchLower = search.toLowerCase();
      const matchesSearch = 
        f.title.toLowerCase().includes(searchLower) || 
        f.subject.toLowerCase().includes(searchLower) ||
        f.uploader.toLowerCase().includes(searchLower);
      
      const matchesSubject = subjectFilter === 'All' || f.subject === subjectFilter;
      
      return matchesSearch && matchesSubject;
    });
  }, [files, search, subjectFilter, userRoll, userRole]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return '📄';
      case 'DOC': return '📝';
      case 'PPT': return '📽️';
      case 'ZIP': return '📦';
      case 'IMG': return '🖼️';
      default: return '📁';
    }
  };

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <div className="flex-1">
          <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Academic Repository</h2>
          <p className="text-slate-500 font-medium text-lg max-w-xl leading-relaxed">
            Browse through {files.filter(f => f.status === 'Approved').length} verified academic assets indexed for your success.
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full xl:w-auto">
           <div className="space-y-4">
             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] px-1">Taxonomy Filters</span>
             <div className="flex gap-2.5 overflow-x-auto pb-4 custom-scrollbar snap-x">
                <button
                  onClick={() => setSubjectFilter('All')}
                  className={`snap-start px-5 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest border whitespace-nowrap ${
                    subjectFilter === 'All' 
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20' 
                      : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  All Categories
                </button>
                {subjects.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSubjectFilter(s.name)}
                    className={`snap-start px-5 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest border whitespace-nowrap ${
                      subjectFilter === s.name 
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20' 
                        : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
             </div>
           </div>
        </div>
      </div>

      <div className="relative group max-w-5xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[3rem] blur opacity-10 group-focus-within:opacity-20 transition-opacity"></div>
        <input 
          type="text" 
          placeholder="Search assets by title, subject, or academic ID..." 
          className="relative w-full pl-16 pr-32 py-6 rounded-[3rem] border border-slate-800 bg-slate-900/50 backdrop-blur-md shadow-2xl focus:border-indigo-500 outline-none transition-all text-xl font-black text-white placeholder:text-slate-700 placeholder:font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="absolute left-7 top-1/2 -translate-y-1/2 text-2xl opacity-40 group-focus-within:opacity-100 transition-opacity">🔍</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredFiles.map(file => {
          const isPending = file.status === 'Pending';
          const isMine = file.uploader === userRoll;
          const isAdmin = userRole === 'Admin';

          return (
            <div key={file.id} className={`bg-slate-900/40 backdrop-blur-sm p-6 rounded-[2.5rem] border shadow-xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all group flex flex-col relative overflow-hidden group hover:-translate-y-1.5 ${isPending ? 'border-amber-500/30' : 'border-slate-800'}`}>
              
              {/* Status Badge - Decreased size */}
              {isPending && isMine && !isAdmin && (
                <div className="absolute top-6 right-6 z-10">
                   <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-500/20 animate-in slide-in-from-right-4">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                      Pending
                   </div>
                </div>
              )}
              
              {isAdmin && (
                <div className="absolute top-6 right-6 z-10">
                   <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${isPending ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                      {file.status}
                   </div>
                </div>
              )}

              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-slate-950 rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner border border-slate-800 group-hover:scale-110 transition-transform">
                    {getFileIcon(file.fileType)}
                  </div>
                  <div className="pr-2">
                     <h3 className="text-lg font-black text-white leading-tight mb-1 line-clamp-2">{file.title}</h3>
                     <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">{file.subject}</p>
                  </div>
                </div>
              </div>

              <div className="mb-8 flex-1">
                 <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-medium">
                    {file.description || 'Verified academic resource submitted for peer review and exam excellence.'}
                 </p>
                 <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mt-1.5">ID: {file.uploader}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-8">
                 <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-0.5">TYPE</p>
                    <p className="text-[10px] font-bold text-slate-300">{file.fileType}</p>
                 </div>
                 <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-0.5">SIZE</p>
                    <p className="text-[10px] font-bold text-slate-300">{file.fileSize}</p>
                 </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-800/50">
                 <div className="flex flex-col">
                    <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-0.5">PUBLISHED</span>
                    <span className="text-[10px] text-slate-400 font-bold">{file.uploadDate}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    {(isAdmin || isMine) && (
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation();
                          if(window.confirm('Erase this asset permanently?')) onDelete(file.id); 
                        }}
                        className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                        title="Delete Asset"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </button>
                    )}
                    {isPending && !isAdmin ? (
                      <div className="text-[9px] text-amber-500/80 font-black uppercase italic tracking-widest">Verifying...</div>
                    ) : (
                      <button 
                        onClick={() => onDownload(file.id)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-[10px] hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                      >
                        Download 
                      </button>
                    )}
                 </div>
              </div>
            </div>
          );
        })}

        {filteredFiles.length === 0 && (
          <div className="col-span-full py-32 text-center bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-800">
             <div className="text-6xl opacity-10 mb-6">🔎</div>
             <h4 className="text-2xl font-black text-white mb-2 tracking-tight">Empty Result</h4>
             <p className="text-slate-500 font-medium mb-8">No indexed assets found.</p>
             <button onClick={() => setSearch('')} className="bg-indigo-600/20 text-indigo-400 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Reset</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Repository;
