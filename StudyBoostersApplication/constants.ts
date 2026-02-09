
import { StudyFile, UserActivity, SyllabusItem } from './types';

/**
 * MOCK_FILES is now empty to satisfy the request to remove all approved files.
 * New uploads will appear here after being added by users.
 */
export const MOCK_FILES: StudyFile[] = [];

/**
 * Reduced to exactly one user log as requested.
 */
export const MOCK_USERS: UserActivity[] = [
  { userId: '21CS102', userName: 'Rahul Sharma', uploadCount: 0, lastActive: 'Just now' }
];

export const INITIAL_SYLLABUS: SyllabusItem[] = [
  { id: 's1', subject: 'CS101', moduleName: 'Introduction to Algorithms', completed: true, priority: 'High' },
  { id: 's2', subject: 'CS101', moduleName: 'Complexity Analysis', completed: false, priority: 'High' },
  { id: 's3', subject: 'MATH202', moduleName: 'Linear Algebra', completed: false, priority: 'Medium' },
  { id: 's4', subject: 'OS301', moduleName: 'Memory Management', completed: false, priority: 'High' },
];
