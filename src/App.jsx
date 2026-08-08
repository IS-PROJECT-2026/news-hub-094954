import React from 'react';
import './App.css';
import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import LoginModal from './components/LoginModal';

function AppInner() {
  const { showLoginModal } = useAppContext();

  return (
    <div>
      <Header searchValue="" onSearchChange={() => {}} />
      {showLoginModal && <LoginModal />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}