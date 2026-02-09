
import React, { useState } from 'react';
import { StudyFile, ActivityLog, MentorRequest, Subject } from '../types';

interface AdminDashboardProps {
  files: StudyFile[];
  logs: ActivityLog[];
  subjects: Subject[];
  onAddSubject: (name: string) => void;
  onDeleteSubject: (id: string) => void;
  mentorRequests: MentorRequest[];
  onApproveMentor: (id: string) => void;
  onRejectMentor: (id: string) => void;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  manualReview: boolean;
  onToggleReviewMode: () => void;
  onClearAll: () => void;
  latestNews?: string;
  onUpdateSettings: (settings: any) => void;
  onDownload: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  files,
  logs,
  subjects,
  onAddSubject,
  onDeleteSubject,
  mentorRequests,
  onApproveMentor,
  onRejectMentor,
  onDelete,
  onApprove,
  manualReview,
  onToggleReviewMode,
  onClearAll,
  latestNews,
  onUpdateSettings,
  onDownload
}) => {
  const [activeTab, setActiveTab] = useState<'Pending' | 'Approved' | 'Users' | 'Mentors' | 'Subjects'>('Pending');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  const pendingFiles = files.filter(f => f.status === 'Pending');
  const approvedFiles = files.filter(f => f.status === 'Approved');
  const pendingMentors = mentorRequests.filter(r => r.status === 'Pending');
  const approvedMentors = mentorRequests.filter(r => r.status === 'Approved');

  const getTimeAgo = (timestamp: string) => {
    try {
      const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
      if (seconds < 60) return 'Just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      return new Date(timestamp).toLocaleDateString();
    } catch {
      return 'Recent';
    }
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      onAddSubject(newSubjectName.trim());
      setNewSubjectName('');
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="px-4 py-1.5 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-red-500/20">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block mr-2 animate-pulse"></span>
              ADMINISTRATIVE OVERRIDE
            </div>
            <button
              onClick={() => setShowConfirmReset(true)}
              className="px-4 py-1.5 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all border border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              ☢️ FACTORY RESET
            </button>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter">Command Center</h2>
          <p className="text-slate-500 font-medium text-lg">Managing campus knowledge infrastructure.</p>
        </div>

        <div className="flex p-1.5 bg-slate-900 border border-slate-800 rounded-[1.5rem] flex-wrap gap-1 shadow-2xl backdrop-blur-xl">
          {[
            { id: 'Pending', label: 'File Review', count: pendingFiles.length },
            { id: 'Mentors', label: 'Mentor Ops', count: pendingMentors.length },
            { id: 'Subjects', label: 'Subjects' },
            { id: 'Approved', label: 'Asset Map' },
            { id: 'Users', label: 'System Logs' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-7 py-3 rounded-xl text-[11px] font-black transition-all relative uppercase tracking-widest ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
            >
              {tab.label}
              {tab.count && tab.count > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white text-[9px] flex items-center justify-center rounded-full animate-bounce shadow-lg shadow-red-600/30">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {showConfirmReset && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-6">
          <div className="bg-slate-900 rounded-[3rem] p-12 max-w-md w-full shadow-3xl border border-red-500/20 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner border border-red-500/20">⚠️</div>
            <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">System Purge?</h3>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              All assets, logs, subjects and configurations will be permanently erased. This operation cannot be reversed.
            </p>
            <div className="flex gap-5">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-5 bg-slate-800 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all"
              >
                ABORT
              </button>
              <button
                onClick={() => { onClearAll(); setShowConfirmReset(false); }}
                className="flex-1 py-5 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500 transition-all shadow-xl shadow-red-600/20"
              >
                EXECUTE WIPE
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl relative overflow-hidden group">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Live Updates</p>
        <div className="flex flex-col gap-3">
          <textarea
            className="bg-slate-950 text-white text-sm p-4 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none resize-none font-medium"
            rows={3}
            placeholder="Post a customized update for the homepage..."
            defaultValue={latestNews || ''}
            id="newsInput"
          />
          <div className="flex justify-end">
            <button
              onClick={() => {
                const input = document.getElementById('newsInput') as HTMLTextAreaElement;
                if (input) onUpdateSettings({ latestNews: input.value });
              }}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
            >
              Post Update
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl relative overflow-hidden group">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Verification Logic</p>
          <div className="flex items-center justify-between">
            <span className={`text-xl font-black ${manualReview ? 'text-amber-500' : 'text-emerald-500'}`}>{manualReview ? 'STRICT MODERATION' : 'AUTOMATED INDEXING'}</span>
            <button onClick={onToggleReviewMode} className="bg-slate-950 text-indigo-400 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-800 hover:border-indigo-500/50 transition-all">CHANGE</button>
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl relative overflow-hidden group">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Heartbeat</p>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
            <span className="text-xl font-black text-white tracking-tight">NODES ACTIVE</span>
          </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl relative overflow-hidden group">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Asset Inventory</p>
          <span className="text-xl font-black text-white tracking-tight">{files.length} ITEMS INDEXED</span>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[3rem] border border-slate-800 shadow-3xl overflow-hidden min-h-[500px] backdrop-blur-xl">
        {activeTab === 'Pending' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Signature</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Origin User</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Protocol Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {pendingFiles.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-10 py-32 text-center">
                      <div className="text-slate-700 font-black text-lg uppercase tracking-widest opacity-30">Review Buffer Empty</div>
                    </td>
                  </tr>
                ) : (
                  pendingFiles.map(file => (
                    <tr key={file.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-slate-950 text-indigo-400 rounded-2xl flex items-center justify-center font-black border border-slate-800 text-lg shadow-inner">
                            {file.fileType.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-white text-lg leading-none mb-2 group-hover:text-indigo-400 transition-colors">{file.title}</p>
                            <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">{file.subject}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-sm font-bold text-slate-400">{file.uploader}</td>
                      <td className="px-10 py-8 text-center">
                        <div className="flex items-center justify-center gap-5">
                          <button onClick={() => onDownload(file.id)} className="bg-indigo-500/10 text-indigo-500 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all">INSPECT</button>
                          <button onClick={() => onApprove(file.id)} className="bg-emerald-600/10 text-emerald-500 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-all">APPROVE</button>
                          <button onClick={() => onDelete(file.id)} className="bg-red-500/10 text-red-500 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-600 hover:text-white transition-all">REJECT</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Subjects' && (
          <div className="p-12 space-y-12">
            <form onSubmit={handleAddSubject} className="flex gap-5">
              <input
                type="text"
                placeholder="Declare new academic category..."
                className="flex-1 p-6 rounded-[1.5rem] border border-slate-800 bg-slate-950 focus:border-indigo-500 outline-none font-black text-white transition-all shadow-inner"
                value={newSubjectName}
                onChange={e => setNewSubjectName(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-10 py-6 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 border border-indigo-400/20"
              >
                COMMIT SUBJECT
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {subjects.map(s => (
                <div key={s.id} className="p-6 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-slate-700 transition-colors shadow-sm">
                  <span className="font-bold text-slate-400 group-hover:text-white transition-colors">{s.name}</span>
                  <button
                    onClick={() => onDeleteSubject(s.id)}
                    className="p-2.5 text-slate-800 hover:text-red-500 transition-colors bg-slate-900 rounded-xl"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Approved' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Asset</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Publisher</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Governance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {approvedFiles.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-10 py-32 text-center">
                      <div className="text-slate-700 font-black text-lg uppercase tracking-widest opacity-30">Asset Map Empty</div>
                    </td>
                  </tr>
                ) : (
                  approvedFiles.map(file => (
                    <tr key={file.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center font-black border border-emerald-500/20 text-lg shadow-inner">
                            {file.fileType.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-white text-lg leading-none mb-2 group-hover:text-emerald-400 transition-colors">{file.title}</p>
                            <div className="flex gap-3">
                              <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">{file.subject}</p>
                              <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                                LIVE
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-300">{file.uploader}</span>
                          <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{file.downloadCount} Downloads</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <div className="flex items-center justify-center gap-5">
                          <button onClick={() => onDelete(file.id)} className="bg-red-500/10 text-red-500 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-600 hover:text-white transition-all group/btn">
                            <span className="group-hover/btn:hidden">REVOKE ASSET</span>
                            <span className="hidden group-hover/btn:inline">CONFIRM DELETE</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Mentors' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 border-b border-slate-800">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Applicant</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Expertise & Year</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {pendingMentors.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-10 py-32 text-center">
                      <div className="text-slate-700 font-black text-lg uppercase tracking-widest opacity-30">No Mentor Cleanups</div>
                    </td>
                  </tr>
                ) : (
                  pendingMentors.map(req => (
                    <tr key={req.id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center font-bold border border-indigo-500/20">
                            {req.rollNumber.charAt(0)}
                          </div>
                          <span className="font-black text-white tracking-tight">{req.rollNumber}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-1">
                          <p className="font-bold text-white text-sm">{req.expertise}</p>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{req.year}</p>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center">
                        <div className="flex items-center justify-center gap-5">
                          <button onClick={() => onApproveMentor(req.id)} className="bg-emerald-600/10 text-emerald-500 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-all">APPROVE</button>
                          <button onClick={() => onRejectMentor(req.id)} className="bg-red-500/10 text-red-500 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-600 hover:text-white transition-all">REJECT</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Users' && (
          <div className="p-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-10">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Audit Trail</h4>
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">LIVE STREAM</span>
                </div>
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-4">
                {logs.length === 0 ? (
                  <div className="py-40 text-center text-slate-700 font-black uppercase tracking-[0.2em] opacity-30">Audit Log Empty</div>
                ) : (
                  [...logs].reverse().map(log => (
                    <div key={log.id} className="flex items-start gap-6 p-6 rounded-[2rem] bg-slate-950 border border-slate-800/50 hover:bg-slate-900 transition-all group border-l-4 border-l-indigo-600/30 hover:border-l-indigo-600">
                      <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-lg border border-slate-800 group-hover:scale-110 transition-transform">
                        🕒
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-black text-white text-base tracking-tight">{log.action}</p>
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{getTimeAgo(log.timestamp)}</span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{log.details}</p>
                        {log.downloads !== undefined && log.downloads > 0 && (
                          <div className="mt-3 inline-block text-[9px] font-black text-indigo-400 bg-indigo-500/5 px-2.5 py-1 rounded border border-indigo-500/10 uppercase tracking-widest">INTERACTION DEPTH: {log.downloads}</div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
};

export default AdminDashboard;
