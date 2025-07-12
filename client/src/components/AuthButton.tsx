import React, { useState, useEffect } from 'react';
import { signInWithGoogle, signOutUser, getCurrentUser, onAuthStateChange } from '../services/authService';
import { User } from 'firebase/auth';

interface AuthButtonProps {
  onToggle3D?: (enabled: boolean) => void;
  is3DMode?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ onToggle3D, is3DMode = false }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);

  useEffect(() => {
    // Set initial user state
    setUser(getCurrentUser());

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setShowSignOut(false); // Hide dropdown when user changes
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOutUser();
      setShowSignOut(false);
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSignOut = () => {
    setShowSignOut(!showSignOut);
  };

  const handleToggle3D = () => {
    if (onToggle3D) {
      onToggle3D(!is3DMode);
    }
  };

  const getFirstName = (displayName: string | null, email: string | null): string => {
    if (displayName) {
      return displayName.split(' ')[0];
    }
    if (email) {
      return email.split('@')[0];
    }
    return 'User';
  };

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 1000,
    }}>
      {user ? (
        <div style={{ position: 'relative' }}>
          {/* User info - clickable */}
          <div 
            onClick={toggleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.95)',
              padding: '12px 16px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: '1px solid rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <img 
              src={user.photoURL || undefined} 
              alt="Profile" 
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '50%',
                border: '2px solid #fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} 
            />
            <span style={{ 
              fontSize: '15px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontWeight: '500',
              color: '#2c3e50',
              letterSpacing: '0.3px'
            }}>
              Welcome, {getFirstName(user.displayName, user.email)} 🚴
            </span>
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 24 24"
              style={{
                transition: 'transform 0.2s ease',
                transform: showSignOut ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            >
              <path fill="#2c3e50" d="M7 10l5 5 5-5z"/>
            </svg>
          </div>

          {/* Sign out dropdown */}
          {showSignOut && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              marginTop: '4px',
              background: 'rgba(255, 255, 255, 0.98)',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.1)',
              overflow: 'hidden',
              animation: 'slideDown 0.2s ease',
              minWidth: '200px'
            }}>
              {/* 3D Toggle Button */}
              <button 
                onClick={handleToggle3D}
                style={{
                  padding: '12px 20px',
                  backgroundColor: 'transparent',
                  color: '#2c3e50',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderBottom: '1px solid rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 124, 191, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {is3DMode ? '🗺️ 2D' : '🏢 3D'}
              </button>

              {/* Sign Out Button */}
              <button 
                onClick={handleSignOut}
                disabled={loading}
                style={{
                  padding: '12px 20px',
                  backgroundColor: 'transparent',
                  color: '#dc3545',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                {loading ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          {/* Sign In Button */}
          <button 
            onClick={handleSignIn}
            disabled={loading}
            style={{
              padding: '12px 20px',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 8px rgba(66, 133, 244, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(66, 133, 244, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(66, 133, 244, 0.3)';
              }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          {/* 3D Toggle Button for non-authenticated users */}
          <button 
            onClick={handleToggle3D}
            style={{
              padding: '8px 12px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#2c3e50',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            {is3DMode ? '🗺️ 2D' : '🏢 3D'}
          </button>
        </div>
      )}

      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default AuthButton; 