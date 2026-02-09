
export type UserRole = 'Student' | 'Admin' | 'Mentor';

export interface User {
  rollNumber: string;
  role: UserRole;
  lastLogin: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
}

export interface StudyFile {
  id: string;
  title: string;
  subject: string;
  semester: string;
  uploader: string;
  uploaderId: string;
  fileType: 'PDF' | 'DOC' | 'PPT' | 'ZIP' | 'IMG';
  fileSize: string;
  uploadDate: string;
  downloadCount: number;
  description?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  fileBlobData?: string;
  fileChunks?: string[];
}

export interface UserActivity {
  userId: string;
  userName: string;
  uploadCount: number;
  lastActive: string;
}

export interface Settings {
  manualReview: boolean;
  latestNews?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details?: string;
  downloads?: number;
}

export interface SyllabusItem {
  id: string;
  subject: string;
  moduleName: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

export interface DoubtRequest {
  id: string;
  studentName: string;
  subject: string;
  question: string;
  status: 'Pending' | 'Answered';
  timestamp: string;
}

export interface MentorRequest {
  id: string;
  rollNumber: string;
  expertise: string;
  year: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
}

export interface LostItem {
  id: string;
  itemName: string;
  description: string;
  category: 'Electronics' | 'Books' | 'ID Card' | 'Keys' | 'Clothing' | 'Other';
  location: string;
  dateReported: string;
  reportedBy: string;
  status: 'Lost' | 'Found';
  contactInfo?: string;
  imageUrl?: string;
  timestamp: string;
}

export type View = 'Home' | 'Browse' | 'Upload' | 'Dashboard' | 'Insights' | 'Tracker' | 'Doubts' | 'LostItems';
