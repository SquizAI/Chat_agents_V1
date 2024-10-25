import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MessagingPanel from './components/MessagingPanel';
import ContactsPanel from './components/ContactsPanel';
import CampaignsPanel from './components/CampaignsPanel';
import RemindersPanel from './components/RemindersPanel';
import AddressResearchPanel from './components/AddressResearchPanel';
import { AIProvider } from './contexts/AIContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import ToastContainer from './components/Toast';

export default function App() {
  return (
    <ThemeProvider>
      <AIProvider>
        <ErrorBoundary>
          <Router>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Routes>
                  <Route path="/" element={<MessagingPanel />} />
                  <Route path="/contacts" element={<ContactsPanel />} />
                  <Route path="/address-research" element={<AddressResearchPanel />} />
                  <Route path="/campaigns" element={<CampaignsPanel />} />
                  <Route path="/reminders" element={<RemindersPanel />} />
                </Routes>
              </div>
            </div>
          </Router>
          <ToastContainer />
        </ErrorBoundary>
      </AIProvider>
    </ThemeProvider>
  );
}