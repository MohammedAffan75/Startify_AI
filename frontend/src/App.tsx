import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { AuthenticationPage } from "./components/AuthenticationPage";
import { Toaster } from "./components/ui/sonner";

type AppView = 'landing' | 'auth' | 'dashboard';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  plan: 'free' | 'professional' | 'enterprise';
  createdAt: Date;
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);

  // Check for existing user session on app load with real backend validation
  useEffect(() => {
    const checkAuthSession = async () => {
      const authToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('startify_user');
      
      if (authToken && savedUser) {
        try {
          // Validate session with backend
          const response = await fetch(`https://qtasahyujisrwvwepprd.supabase.co/functions/v1/make-server-b819addc/user/profile`, {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            if (currentView === 'landing') {
              setCurrentView('dashboard');
            }
          } else {
            // Invalid session, clear storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('startify_user');
          }
        } catch (error) {
          console.error('Session validation error:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('startify_user');
        }
      }
    };

    checkAuthSession();
  }, []);

  const handleGetStarted = () => {
    setCurrentView('auth');
  };

  const handleAuthenticated = (userData: UserProfile) => {
    setUser(userData);
    setCurrentView('dashboard');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('startify_user');
    localStorage.removeItem('auth_token');
    setCurrentView('landing');
  };

  const handleUpgradePlan = (plan: 'professional' | 'enterprise') => {
    // Show auth page for plan upgrade
    setCurrentView('auth');
  };

  return (
    <div className="min-h-screen transition-colors duration-300 overflow-x-hidden w-full">
      {currentView === 'landing' && (
        <LandingPage 
          onGetStarted={handleGetStarted} 
          onUpgradePlan={handleUpgradePlan}
          currentUser={user}
        />
      )}
      
      {currentView === 'auth' && (
        <AuthenticationPage 
          onAuthenticated={handleAuthenticated}
          onBack={handleBackToLanding}
        />
      )}
      
      {currentView === 'dashboard' && user && (
        <Dashboard 
          onBack={handleBackToLanding}
          onSignOut={handleSignOut}
          user={user}
        />
      )}
      
      <Toaster />
    </div>
  );
}