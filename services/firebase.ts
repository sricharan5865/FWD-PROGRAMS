
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push, set, update, remove, child } from "firebase/database";

/**
 * FIREBASE SECURITY RULES (Paste these in your Firebase Console > Realtime Database > Rules):
 * 
 * {
 *   "rules": {
 *     "study_boosters": {
 *       ".read": true,
 *       ".write": true
 *     }
 *   }
 * }
 */

const firebaseConfig = {
  apiKey: "AIzaSyAs-EXAMPLE-KEY-REPLACE-ME",
  authDomain: "study-boosters.firebaseapp.com",
  databaseURL: "https://study-boosters-default-rtdb.firebaseio.com/",
  projectId: "study-boosters",
  storageBucket: "study-boosters.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const rootRef = ref(db, 'study_boosters');

export const dbRefs = {
  root: rootRef,
  files: ref(db, 'study_boosters/files'),
  doubts: ref(db, 'study_boosters/doubts'),
  mentorRequests: ref(db, 'study_boosters/mentor_requests'),
  logs: ref(db, 'study_boosters/logs'),
  syllabus: ref(db, 'study_boosters/syllabus'),
  settings: ref(db, 'study_boosters/settings'),
  subjects: ref(db, 'study_boosters/subjects'),
  users: ref(db, 'study_boosters/users'),
  lostItems: ref(db, 'study_boosters/lost_items')
};

export const subscribeToList = (reference: any, callback: (data: any[]) => void) => {
  return onValue(reference, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const list = Object.keys(data).map(key => ({
        ...data[key],
        id: key
      }));
      callback(list);
    } else {
      callback([]);
    }
  });
};

export const subscribeToValue = (reference: any, callback: (data: any) => void) => {
  return onValue(reference, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};



// Sync User Profile (Create if new, fetch if exists)
export const syncUser = async (rollNumber: string, defaultRole: 'Student' | 'Admin' = 'Student'): Promise<any> => {
  const userRef = child(dbRefs.users, rollNumber);
  return new Promise((resolve) => {
    onValue(userRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Update Last Login
        await update(userRef, { lastLogin: new Date().toISOString() });
        resolve(data);
      } else {
        // Create New User
        const newUser = {
          rollNumber,
          role: defaultRole,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        await set(userRef, newUser);
        resolve(newUser);
      }
    }, { onlyOnce: true });
  });
};

// Push new item with Error Handling
export const pushToRef = async (reference: any, data: any) => {
  try {
    const newRef = push(reference);
    await set(newRef, data);
    return newRef.key;
  } catch (error) {
    console.error("Firebase Push Error:", error);
    throw error;
  }
};

// Set specific value with Error Handling
export const setToRef = async (reference: any, data: any) => {
  try {
    await set(reference, data);
  } catch (error) {
    console.error("Firebase Set Error:", error);
    throw error;
  }
};

// Update existing item with Error Handling
export const updateInRef = async (reference: any, id: string, data: any) => {
  try {
    const itemRef = child(reference, id);
    await update(itemRef, data);
  } catch (error) {
    console.error("Firebase Update Error:", error);
    throw error;
  }
};

// Remove item with Error Handling
export const removeFromRef = async (reference: any, id: string) => {
  try {
    const itemRef = child(reference, id);
    await remove(itemRef);
  } catch (error) {
    console.error("Firebase Remove Error:", error);
    throw error;
  }
};

// Nuclear reset with Error Handling
export const clearDatabase = async () => {
  try {
    await remove(rootRef);
  } catch (error) {
    console.error("Firebase Clear Error:", error);
    throw error;
  }
};

export default db;
