
import React, { useState } from 'react';
import { DoubtRequest, MentorRequest } from '../types';

interface DoubtSectionProps {
  doubts: DoubtRequest[];
  mentorRequests: MentorRequest[];
  onAddDoubt: (subject: string, question: string) => void;
  onRegisterMentor: (expertise: string, year: string) => void;
  userRoll: string;
}

const DoubtSection: React.FC<DoubtSectionProps> = ({ doubts, mentorRequests, onAddDoubt, onRegisterMentor, userRoll }) => {
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showMentorForm, setShowMentorForm] = useState(false);
  
  const [mentorFormData, setMentorFormData] = useState({
    expertise: '',
    year: 'Final Year'
  });

  const myMentorRequest = mentorRequests.find(r => r.rollNumber === userRoll);
  const isApprovedMentor = myMentorRequest?.status === 'Approved';
  const isPendingMentor = myMentorRequest?.status === 'Pending';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject && question) {
      onAddDoubt(subject, question);
      setSubject('');
      setQuestion('');
      setShowForm(false);
    }
  };

  const handleMentorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onRegisterMentor(mentorFormData.expertise, mentorFormData.year);
    setShowMentorForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter mb-4 uppercase">Doubt Hub</h2>
          <p className="text-slate-500 text-lg font-medium">Peer-to-peer engineering support network.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-10 py-4.5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95 whitespace-nowrap"
        >
          {showForm ? 'Abort Request' : 'Broadcast Doubt'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900/50 backdrop-blur-xl p-10 rounded-[3rem] border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.1)] space-y-8 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">Context (Subject)</label>
              <input 
                type="text" 
                className="w-full p-5 rounded-2xl border border-slate-800 bg-slate-950 focus:border-indigo-500 outline-none text-white font-black" 
                placeholder="e.g. Distributed Systems"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">The Inquiry</label>
            <textarea 
              className="w-full p-6 h-40 rounded-[2rem] border border-slate-800 bg-slate-950 focus:border-indigo-500 outline-none resize-none text-white font-medium leading-relaxed" 
              placeholder="Describe your technical bottleneck in detail..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:shadow-indigo-500/30 transition-all active:scale-95">
            Commit to Hub
          </button>
        </form>
      )}

      {/* Mentor Onboarding Modal */}
      {showMentorForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 w-full max-w-md rounded-[3.5rem] p-12 shadow-3xl border border-slate-800 animate-in zoom-in-95 duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl"></div>
            <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">Mentor Circle</h3>
            <p className="text-slate-500 text-sm mb-10 font-medium">Verify your expertise to support the network.</p>
            
            <form onSubmit={handleMentorRegister} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block ml-1">Area of Expertise</label>
                <input 
                  type="text" 
                  placeholder="e.g. Graph Theory, React"
                  className="w-full p-5 rounded-2xl border border-slate-800 bg-slate-950 focus:border-indigo-500 outline-none transition-all font-bold text-white"
                  value={mentorFormData.expertise}
                  onChange={e => setMentorFormData({...mentorFormData, expertise: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest block ml-1">Academic Year</label>
                <select 
                   className="w-full p-5 rounded-2xl border border-slate-800 bg-slate-950 focus:border-indigo-500 outline-none font-bold text-white appearance-none cursor-pointer"
                   value={mentorFormData.year}
                   onChange={e => setMentorFormData({...mentorFormData, year: e.target.value})}
                >
                  <option>Second Year</option>
                  <option>Third Year</option>
                  <option>Final Year</option>
                  <option>Alumni</option>
                </select>
              </div>
              <div className="flex gap-4 pt-6">
                <button 
                  type="button" 
                  onClick={() => setShowMentorForm(false)}
                  className="flex-1 py-5 bg-slate-800 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                >
                  Apply Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {doubts.length === 0 ? (
          <div className="py-32 text-center bg-slate-950/40 rounded-[3rem] border-2 border-dashed border-slate-800">
            <p className="text-slate-700 font-black uppercase tracking-[0.3em] text-xs">Signal Buffer Clear</p>
          </div>
        ) : (
          doubts.map(doubt => (
            <div key={doubt.id} className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-xl border border-slate-800 group hover:border-indigo-500/30 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center font-black text-white text-xl border border-slate-800 shadow-inner group-hover:scale-110 transition-transform">
                    {doubt.studentName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-lg tracking-tight">{doubt.studentName}</h4>
                    <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">{doubt.subject}</p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${
                  doubt.status === 'Answered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-950 text-slate-600 border-slate-800'
                }`}>
                  {doubt.status}
                </div>
              </div>
              
              <p className="text-slate-400 mb-8 text-base leading-relaxed font-medium">
                {doubt.question}
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
                  BROADCASTED {getTimeAgo(doubt.timestamp)}
                </span>
                <button 
                  className={`font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 ${isApprovedMentor ? 'text-indigo-400 hover:text-indigo-300' : 'text-slate-800 cursor-not-allowed opacity-50'}`}
                  disabled={!isApprovedMentor}
                >
                   TRANSMIT RESPONSE <span>💬</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Mentor Portal CTA */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-[4rem] p-16 text-white relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/5">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="max-w-xl">
            {isApprovedMentor ? (
              <>
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                  Official Senior Mentor
                </div>
                <h3 className="text-4xl font-black mb-4 tracking-tighter">Your Leadership Active</h3>
                <p className="text-indigo-200 text-lg font-medium leading-relaxed">
                  Support the community by answering doubts. Verified responses earn prestige points for your academic profile.
                </p>
              </>
            ) : isPendingMentor ? (
              <>
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                  Credentials Under Review
                </div>
                <h3 className="text-4xl font-black mb-4 tracking-tighter">Identity Confirmation</h3>
                <p className="text-indigo-200 text-lg font-medium leading-relaxed">
                  The campus admin layer is verifying your expertise. Full mentor permissions will be assigned upon approval.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-4xl font-black mb-4 tracking-tighter leading-tight">Elite Mentor Onboarding</h3>
                <p className="text-indigo-200 text-lg font-medium leading-relaxed">
                  Join the circle of senior mentors. Earn exclusive campus rewards by resolving high-priority academic doubts.
                </p>
              </>
            )}
          </div>
          {!isApprovedMentor && !isPendingMentor && (
            <button 
              onClick={() => setShowMentorForm(true)}
              className="bg-white text-slate-950 px-12 py-5 rounded-[2rem] font-black hover:bg-slate-100 transition-all text-xs uppercase tracking-widest shadow-2xl active:scale-95 whitespace-nowrap"
            >
              Initialize Onboarding
            </button>
          )}
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      </div>
    </div>
  );
};

function getTimeAgo(timestamp: string) {
    try {
      const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
      if (seconds < 60) return 'Just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}M ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}H ago`;
      return new Date(timestamp).toLocaleDateString();
    } catch {
      return 'RECENTLY';
    }
}

export default DoubtSection;
