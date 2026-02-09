/**
 * Application Entry Point
 * 
 * This file serves as the entry point for the Study Boosters React application.
 * It initializes the React root and mounts the main App component to the DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get the root DOM element where the React app will be mounted
// This element is defined in index.html with id="root"
const rootElement = document.getElementById('root');

// Safety check: Ensure the root element exists before attempting to render
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Create a React root for concurrent rendering (React 18+)
const root = ReactDOM.createRoot(rootElement);

// Render the application wrapped in StrictMode
// StrictMode helps identify potential problems in the application:
// - Identifies components with unsafe lifecycles
// - Warns about legacy string ref API usage
// - Detects unexpected side effects
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
