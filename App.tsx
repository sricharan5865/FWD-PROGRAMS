
import React, { useState, useEffect, useMemo } from 'react';
import { View, StudyFile, SyllabusItem, UserRole, DoubtRequest, ActivityLog, MentorRequest, Subject, LostItem } from './types';
import { INITIAL_SYLLABUS } from './constants';
import Login from './components/LoginForm';
import Dashboard from './components/Dashboard';
import Repository from './components/Repository';
import Insights from './components/Insights';
import Tracker from './components/Tracker';
import Hero from './components/Hero';
import UploadSection from './components/UploadSection';
import AdminDashboard from './components/AdminDashboard';
import DoubtSection from './components/SeniorConnect';
import LostItems from './components/LostItems';
import { dbRefs, subscribeToList, subscribeToValue, pushToRef, updateInRef, removeFromRef, setToRef, clearDatabase } from './services/firebase';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRollNumber, setUserRollNumber] = useState<string>('');
  const [userRole, setUserRole] = useState<UserRole>('Student');
  const [currentView, setCurrentView] = useState<View>('Home');
  const [manualReview, setManualReview] = useState<boolean>(true);
  const [latestNews, setLatestNews] = useState<string>('');
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);

  const [files, setFiles] = useState<StudyFile[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [doubts, setDoubts] = useState<DoubtRequest[]>([]);
  const [mentorRequests, setMentorRequests] = useState<MentorRequest[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [syllabus, setSyllabus] = useState<SyllabusItem[]>(INITIAL_SYLLABUS);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      const unsubFiles = subscribeToList(dbRefs.files, setFiles);
      const unsubLogs = subscribeToList(dbRefs.logs, setLogs);
      const unsubDoubts = subscribeToList(dbRefs.doubts, setDoubts);
      const unsubMentors = subscribeToList(dbRefs.mentorRequests, setMentorRequests);
      const unsubSubjects = subscribeToList(dbRefs.subjects, setSubjects);
      const unsubLostItems = subscribeToList(dbRefs.lostItems, setLostItems);

      const unsubSettings = subscribeToValue(dbRefs.settings, (data) => {
        if (data && typeof data === 'object') {
          if ('manualReview' in data) setManualReview(data.manualReview);
          if ('latestNews' in data) setLatestNews(data.latestNews);
        }
      });

      setIsCloudConnected(true);

      return () => {
        unsubFiles();
        unsubLogs();
        unsubDoubts();
        unsubMentors();
        unsubSubjects();
        unsubSettings();
        unsubLostItems();
      };
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const savedRoll = localStorage.getItem('uniboost_roll_number');
    const savedRole = localStorage.getItem('uniboost_user_role') as UserRole;
    if (savedRoll) {
      setUserRollNumber(savedRoll);
      setUserRole(savedRole || (savedRoll.toUpperCase().includes('ADMIN') ? 'Admin' : 'Student'));
      setIsAuthenticated(true);
    }
  }, []);

  const stats = useMemo(() => {
    const approved = files.filter(f => f.status === 'Approved');
    const downloads = approved.reduce((acc, f) => acc + (f.downloadCount || 0), 0);
    const weekly = files.filter(f => {
      const uploadDate = new Date(f.uploadDate);
      const now = new Date();
      const diff = now.getTime() - uploadDate.getTime();
      return diff < 7 * 24 * 60 * 60 * 1000;
    }).length;

    return {
      totalFiles: (approved.length).toLocaleString(),
      downloads: (downloads / 1000).toFixed(1) + 'K',
      activeUsers: (Math.floor(Math.random() * 5 + 1)).toString(),
      weeklyUploads: '+' + (weekly).toString()
    };
  }, [files]);

  const addLog = async (action: string, details?: string, downloads?: number) => {
    try {
      await pushToRef(dbRefs.logs, {
        action,
        details: details || "",
        downloads: downloads || 0,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Log failed:", err);
    }
  };

  const handleClearDatabase = async () => {
    if (userRole !== 'Admin') return;
    try {
      await clearDatabase();
      await addLog('System Wipe', 'All database records were cleared by admin');
      alert('Database cleared successfully.');
    } catch (err) {
      alert('Error: Permission Denied.');
    }
  };

  const handleLogin = (roll: string) => {
    const role: UserRole = roll.toUpperCase().includes('ADMIN') ? 'Admin' : 'Student';
    localStorage.setItem('uniboost_roll_number', roll);
    localStorage.setItem('uniboost_user_role', role);
    setUserRollNumber(roll);
    setUserRole(role);
    setIsAuthenticated(true);
    setCurrentView('Home');
    addLog(`System Access: ${roll}`, `Role assigned: ${role}`);
  };

  const handleLogout = () => {
    addLog(`Session Ended: ${userRollNumber}`);
    localStorage.removeItem('uniboost_roll_number');
    localStorage.removeItem('uniboost_user_role');
    setIsAuthenticated(false);
    setUserRole('Student');
    setCurrentView('Home');
  };

  const promoteToAdmin = () => {
    setUserRole('Admin');
    localStorage.setItem('uniboost_user_role', 'Admin');
    setCurrentView('Dashboard');
    addLog(`Privilege Escalation`, `User ${userRollNumber} granted Admin control`);
  };

  const deleteFile = async (id: string) => {
    if (userRole !== 'Admin') {
      alert("Permission Denied: Only Admins can delete files.");
      return;
    }
    const file = files.find(f => f.id === id);
    if (!file) return;

    try {
      // Robust removal using the verified Firebase ID
      await removeFromRef(dbRefs.files, id);
      await addLog(`Resource Purged`, `Asset "${file.title}" removed permanently`, file.downloadCount);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("System Conflict: Could not verify asset signature for deletion.");
    }
  };

  const addSubject = async (name: string) => {
    if (userRole !== 'Admin') return;
    try {
      await pushToRef(dbRefs.subjects, { name });
      await addLog(`Subject Created`, `Admin added "${name}"`);
    } catch (err) {
      alert("Failed to add subject.");
    }
  };

  const deleteSubject = async (id: string) => {
    if (userRole !== 'Admin') return;
    try {
      await removeFromRef(dbRefs.subjects, id);
      await addLog(`Subject Deleted`, `Admin removed subject`);
    } catch (err) {
      alert("Failed to delete subject.");
    }
  };

  const approveFile = async (id: string) => {
    if (userRole !== 'Admin') return;
    const file = files.find(f => f.id === id);
    if (file) {
      try {
        await updateInRef(dbRefs.files, id, { status: 'Approved' });
        await addLog(`Resource Approved`, `Admin verified "${file.title}"`, file.downloadCount);
      } catch (err) {
        alert("Approval failed.");
      }
    }
  };

  const handleDownload = async (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file) return;

    try {
      const newCount = (file.downloadCount || 0) + 1;
      await updateInRef(dbRefs.files, id, { downloadCount: newCount });
      await addLog(`Resource Accessed`, `User ${userRollNumber} downloaded "${file.title}"`, newCount);

      if (file.fileBlobData || (file.fileChunks && file.fileChunks.length > 0)) {
        let fullBase64 = file.fileBlobData || '';
        if (file.fileChunks && file.fileChunks.length > 0) {
          fullBase64 = file.fileChunks.join('');
        }

        if (!fullBase64.includes(',')) {
          alert("System Error: Corrupted file data.");
          return;
        }
        const base64Parts = fullBase64.split(',');
        const contentType = base64Parts[0].split(':')[1].split(';')[0];
        const byteCharacters = atob(base64Parts[1]);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;

        const typeExtensions: Record<string, string> = {
          'PDF': 'pdf',
          'DOC': 'docx',
          'PPT': 'pptx',
          'ZIP': 'zip',
          'IMG': 'png'
        };
        const extension = typeExtensions[file.fileType] || 'txt';
        const safeTitle = file.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.setAttribute('download', `${safeTitle}.${extension}`);

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 2000);
      } else {
        alert("System Warning: This legacy resource was uploaded without content storage.");
      }

    } catch (err) {
      console.error("Download Error:", err);
      alert("System Error: Security handshake failed for this asset.");
    }
  };

  const addFile = async (newFileData: any) => {
    if (newFileData.fileSizeBytes > 10 * 1024 * 1024) {
      alert("Security Block: File exceeds 10MB limit.");
      return;
    }
    const { fileSizeBytes, ...metadata } = newFileData;
    const file = {
      ...metadata,
      uploadDate: new Date().toISOString().split('T')[0],
      downloadCount: 0,
      uploader: userRollNumber,
      uploaderId: userRollNumber,
      status: manualReview ? 'Pending' : 'Approved'
    };
    try {
      await pushToRef(dbRefs.files, file);
      await addLog(`Incoming Upload`, `${userRollNumber} submitted "${file.title}"`, 0);
    } catch (err) {
      alert("Upload Failed: Database Permission Denied.");
    }
  };

  const addDoubt = async (subject: string, question: string) => {
    const newDoubt = {
      studentName: userRollNumber,
      subject,
      question,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };
    try {
      await pushToRef(dbRefs.doubts, newDoubt);
      await addLog(`Doubt Created`, `${userRollNumber} in ${subject}`);
    } catch (err) {
      alert("Submission Failed.");
    }
  };

  const submitMentorRequest = async (expertise: string, year: string) => {
    const newRequest = {
      rollNumber: userRollNumber,
      expertise,
      year,
      status: 'Pending',
      timestamp: new Date().toISOString()
    };
    try {
      await pushToRef(dbRefs.mentorRequests, newRequest);
      await addLog(`Mentor Application`, `User ${userRollNumber} applied for ${expertise}`);
    } catch (err) {
      alert("Application Failed.");
    }
  };

  const approveMentor = async (id: string) => {
    const req = mentorRequests.find(r => r.id === id);
    if (req) {
      try {
        await updateInRef(dbRefs.mentorRequests, id, { status: 'Approved' });
        await addLog(`Mentor Approved`, `User ${req.rollNumber} is now an Official Mentor`);
      } catch (err) {
        alert("Action failed.");
      }
    }
  };

  const rejectMentor = async (id: string) => {
    const req = mentorRequests.find(r => r.id === id);
    if (req) {
      try {
        await updateInRef(dbRefs.mentorRequests, id, { status: 'Rejected' });
        await addLog(`Mentor Rejected`, `User ${req.rollNumber} application declined`);
      } catch (err) {
        alert("Action failed.");
      }
    }
  };

  const reportLostItem = async (itemData: Omit<LostItem, 'id' | 'timestamp' | 'dateReported'>) => {
    const newItem = {
      ...itemData,
      dateReported: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };
    try {
      await pushToRef(dbRefs.lostItems, newItem);
      await addLog(`Lost Item Report`, `${userRollNumber} reported: ${itemData.itemName}`);
    } catch (err) {
      alert("Failed to report item.");
    }
  };

  const updateLostItemStatus = async (id: string, status: 'Lost' | 'Found') => {
    const item = lostItems.find(i => i.id === id);
    if (item) {
      try {
        if (status === 'Found') {
          // Delete the item when marked as Found
          await removeFromRef(dbRefs.lostItems, id);
          await addLog(`Lost Item Resolved`, `${item.itemName} was found and removed from system`);
          alert(`Item marked as found and removed from the list!`);
        } else {
          // Update status to Lost
          await updateInRef(dbRefs.lostItems, id, { status });
          await addLog(`Lost Item Update`, `${item.itemName} marked as ${status}`);
        }
      } catch (err) {
        alert("Failed to update status.");
      }
    }
  };

  const deleteLostItem = async (id: string) => {
    if (userRole !== 'Admin') return;
    const item = lostItems.find(i => i.id === id);
    if (item) {
      try {
        await removeFromRef(dbRefs.lostItems, id);
        await addLog(`Lost Item Deleted`, `Admin removed "${item.itemName}"`);
      } catch (err) {
        alert("Failed to delete item.");
      }
    }
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  const renderView = () => {
    switch (currentView) {
      case 'Home':
        return <Hero stats={stats} latestNews={latestNews} onBrowse={() => setCurrentView('Browse')} onUpload={() => setCurrentView('Upload')} />;
      case 'Browse':
        return <Repository subjects={subjects} files={files} userRole={userRole} userRoll={userRollNumber} onDelete={deleteFile} onDownload={handleDownload} />;
      case 'Upload':
        return <UploadSection subjects={subjects} onUpload={addFile} onNavigateToBrowse={() => setCurrentView('Browse')} />;
      case 'Dashboard':
        return userRole === 'Admin'
          ? <AdminDashboard
            files={files}
            logs={logs}
            subjects={subjects}
            onAddSubject={addSubject}
            onDeleteSubject={deleteSubject}
            mentorRequests={mentorRequests}
            onApproveMentor={approveMentor}
            onRejectMentor={rejectMentor}
            onDelete={deleteFile}
            onApprove={approveFile}
            manualReview={manualReview}
            onToggleReviewMode={async () => {
              try {
                const newState = !manualReview;
                await setToRef(dbRefs.settings, { manualReview: newState });
                await addLog(`Mode Change`, `Manual Review set to ${newState ? 'ON' : 'OFF'}`);
              } catch (err) {
                alert("Toggle failed.");
              }
            }}
            onClearAll={handleClearDatabase}
            latestNews={latestNews}
            onUpdateSettings={async (newSettings) => {
              try {
                // Use root ref and 'settings' path to ensure valid update target
                await updateInRef(dbRefs.root, 'settings', newSettings);
                await addLog(`Settings Update`, `Admin updated system configuration`);
              } catch (err) {
                console.error("Settings update failed:", err);
                alert("Settings update failed.");
              }
            }}
            onDownload={handleDownload}
          />
          : <Dashboard
            syllabus={syllabus}
            onNavigate={setCurrentView}
            notesCount={files.filter(f => f.status === 'Approved').length}
            doubtsCount={doubts.length}
            rollNumber={userRollNumber}
            onPromoteToAdmin={promoteToAdmin}
          />;
      case 'Insights':
        return <Insights />;
      case 'Tracker':
        return <Tracker syllabus={syllabus} onToggle={(id) => setSyllabus(s => s.map(i => i.id === id ? { ...i, completed: !i.completed } : i))} />;
      case 'Doubts':
        return <DoubtSection
          doubts={doubts}
          mentorRequests={mentorRequests}
          onAddDoubt={addDoubt}
          onRegisterMentor={submitMentorRequest}
          userRoll={userRollNumber}
        />;
      case 'LostItems':
        return <LostItems
          lostItems={lostItems}
          onReportItem={reportLostItem}
          onUpdateStatus={updateLostItemStatus}
          onDelete={deleteLostItem}
          userRole={userRole}
          userRoll={userRollNumber}
        />;
      default:
        return <Hero stats={stats} onBrowse={() => setCurrentView('Browse')} onUpload={() => setCurrentView('Upload')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-['Inter']">

      <nav className="sticky top-0 z-[100] px-8 py-5 flex items-center justify-between border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
        <div className="flex items-center gap-2 cursor-pointer group shrink-0" onClick={() => setCurrentView('Home')}>
          <div className="group-hover:scale-105 transition-transform">
            <img src="/assets/logo.png" alt="StudyTogether Logo" className="w-12 h-12 object-contain" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white whitespace-nowrap">Virtual Sharing for Better Learning</span>
        </div>

        <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {[
            { name: 'Home', view: 'Home', icon: '🏠' },
            { name: 'Browse Materials', view: 'Browse', icon: '🔍' },
            { name: 'Upload', view: 'Upload', icon: '📤' },
            { name: 'Lost Items', view: 'LostItems', icon: '🔎' },
            { name: 'Dashboard', view: 'Dashboard', icon: '📊' }
          ].map((item) => (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view as View)}
              className={`text-[13px] font-semibold flex items-center gap-2 transition-all ${currentView === item.view ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
            >
              <span className="opacity-70 text-[10px]">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg text-sm font-semibold transition-all border border-red-500/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Exit
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-4">
        {renderView()}
      </main>


    </div>
  );
};

export default App;
