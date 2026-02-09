
import React, { useState, useRef } from 'react';
import { Subject } from '../types';

interface UploadSectionProps {
  subjects: Subject[];
  onUpload: (file: any) => void;
  onNavigateToBrowse: () => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ subjects, onUpload, onNavigateToBrowse }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: subjects.length > 0 ? subjects[0].name : '',
    semester: 'SEM-1',
    fileType: 'PDF' as any,
    description: '',
    fileSize: '0 KB',
    fileSizeBytes: 0,
    fileBlobData: '' as string,
    fileChunks: [] as string[]
  });
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const CHUNK_SIZE = 4 * 1024 * 1024; // 4MB chunks

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`Access Denied: File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds the ${MAX_FILE_SIZE_MB}MB platform limit.`);
        setSelectedFileName(null);
        setFormData(prev => ({ ...prev, fileSize: '0 KB', fileSizeBytes: 0, fileBlobData: '', fileChunks: [] }));

        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Data = event.target?.result as string;

        // Chunking logic
        const chunks: string[] = [];
        for (let i = 0; i < base64Data.length; i += CHUNK_SIZE) {
          chunks.push(base64Data.slice(i, i + CHUNK_SIZE));
        }

        setSelectedFileName(file.name);
        const sizeStr = file.size < 1024 * 1024
          ? (file.size / 1024).toFixed(1) + ' KB'
          : (file.size / (1024 * 1024)).toFixed(1) + ' MB';

        // Map common extensions to our supported types
        const ext = file.name.split('.').pop()?.toUpperCase();
        let mappedType: any = 'PDF';
        if (ext === 'DOC' || ext === 'DOCX') mappedType = 'DOC';
        else if (ext === 'PPT' || ext === 'PPTX') mappedType = 'PPT';
        else if (ext === 'ZIP' || ext === 'RAR') mappedType = 'ZIP';
        else if (['PNG', 'JPG', 'JPEG', 'GIF'].includes(ext || '')) mappedType = 'IMG';

        setFormData(prev => ({
          ...prev,
          fileSize: sizeStr,
          fileSizeBytes: file.size,
          fileBlobData: '', // Clear blob data to prefer chunks
          fileChunks: chunks,
          fileType: mappedType
        }));
      };
      reader.onerror = () => {
        setFileError("Error reading file content.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.fileSizeBytes > MAX_FILE_SIZE_BYTES) {
      setFileError(`Critical Error: File size exceeds ${MAX_FILE_SIZE_MB}MB platform limits.`);
      return;
    }

    if (fileError || !selectedFileName || !formData.subject || (!formData.fileBlobData && formData.fileChunks.length === 0)) return;

    setIsUploading(true);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          onUpload({ ...formData });
          setIsUploading(false);
          setShowSuccess(true);
          return 100;
        }
        return p + 20;
      });
    }, 150);
  };

  const resetUpload = () => {
    setFormData({
      title: '',
      subject: subjects.length > 0 ? subjects[0].name : '',
      semester: 'SEM-1',
      fileType: 'PDF' as any,
      description: '',
      fileSize: '0 KB',
      fileSizeBytes: 0,
      fileBlobData: '',
      fileChunks: []
    });
    setSelectedFileName(null);
    setShowSuccess(false);
    setProgress(0);
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-24 animate-in zoom-in-95 duration-500">
        <div className="bg-slate-900 p-16 rounded-[4rem] border border-slate-800 shadow-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>

          <div className="w-28 h-28 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-10 relative">
            <span className="relative z-10">⏳</span>
            <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-10"></span>
          </div>

          <h2 className="text-4xl font-black text-white mb-6 tracking-tighter">Asset Uploaded!</h2>

          <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl mb-10">
            <p className="text-slate-400 font-bold text-sm">
              Material "{formData.title}" is now <span className="text-amber-500">Awaiting Verification</span>.
            </p>
          </div>

          <p className="text-slate-500 font-medium mb-12 leading-relaxed">
            Our campus moderators will verify the academic relevance of your submission. It will appear in the public repository once approved.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <button
              onClick={onNavigateToBrowse}
              className="flex-1 bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              View Repository
            </button>
            <button
              onClick={resetUpload}
              className="flex-1 bg-slate-800 text-slate-300 py-5 rounded-2xl font-black text-sm hover:bg-slate-700 transition-all active:scale-95"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">Contribute Knowledge</h2>
        <p className="text-slate-500 font-medium text-lg">Scale the campus leaderboard by sharing high-quality study materials.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-slate-900 p-10 rounded-[3rem] border border-slate-800 shadow-2xl space-y-8">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-[2.5rem] p-12 text-center cursor-pointer transition-all bg-slate-950/50 ${fileError
                ? 'border-red-500 bg-red-500/5 shadow-[0_0_30px_rgba(239,68,68,0.1)]'
                : 'border-slate-800 hover:border-indigo-500 hover:bg-indigo-500/5'
                }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="text-5xl mb-4">{fileError ? '🚫' : '📁'}</div>
              <p className={`font-black text-lg ${fileError ? 'text-red-400' : 'text-white'}`}>
                {fileError || selectedFileName || 'Upload Asset'}
              </p>
              <p className={`text-xs mt-2 font-black uppercase tracking-widest ${fileError ? 'text-red-400/60' : 'text-slate-600'}`}>
                PDF, ZIP, DOC (MAX {MAX_FILE_SIZE_MB}MB)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Asset Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Memory Mgmt Notes"
                  className="w-full p-5 rounded-2xl border border-slate-800 bg-slate-950 focus:border-indigo-500 outline-none font-bold text-white transition-all"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Academic Category</label>
                <select
                  required
                  className="w-full p-5 rounded-2xl border border-slate-800 bg-slate-950 focus:border-indigo-500 outline-none font-bold text-white appearance-none cursor-pointer"
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="" disabled>Select subject</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.name} className="bg-slate-900">{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Description (Optional)</label>
              <textarea
                placeholder="What concepts are covered in this asset?"
                className="w-full p-5 h-32 rounded-2xl border border-slate-800 bg-slate-950 focus:border-indigo-500 outline-none font-bold text-white resize-none transition-all"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="pt-6">
              {isUploading ? (
                <div className="space-y-6 text-center animate-in fade-in">
                  <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                    <div className="bg-indigo-600 h-full transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="text-sm font-black text-indigo-400 animate-pulse tracking-widest">ENCRYPTING & UPLOADING... {progress}%</p>
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!formData.title || !formData.subject || !selectedFileName || !!fileError}
                  className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-40 disabled:grayscale border border-indigo-400/20"
                >
                  Deploy to Network
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-slate-800">
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-6 text-indigo-400 tracking-tight">Standard Operating Procedures</h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="text-indigo-500 font-black">01</span>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">Ensure academic relevance. Low-quality assets will be purged.</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-indigo-500 font-black">02</span>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">Maximum file size is strictly capped at <span className="text-white">{MAX_FILE_SIZE_MB}MB</span> per upload.</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-indigo-500 font-black">03</span>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">Manual verification prevents system spam. Processing time: 2-4 hours.</p>
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Node Secure</span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
