import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (data: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (user: User) => void; // <-- Add this
}

interface RegisterPayload {
  email: string;
  password: string;
  name: { first: string; last: string };
  phone: string;
  roles: ('seeker' | 'provider')[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const API_BASE = '/api/auth';
const USER_API = '/api/users/me';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem('accessToken')
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    () => localStorage.getItem('refreshToken')
  );
  const [loading, setLoading] = useState(true); // Start as true
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile if token exists
  useEffect(() => {
    if (accessToken) {
      setLoading(true);
      fetch(USER_API, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('فشل تحميل بيانات المستخدم');
          const data = await res.json();
          setUser({ ...data.data.user, id: data.data.user._id });
          setLoading(false);
        })
        .catch(() => {
          setUser(null);
          setAccessToken(null);
          setRefreshToken(null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || 'فشل تسجيل الدخول');
        setLoading(false);
        return null;
      }
      setAccessToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken);
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      setUser({ ...data.data.user, id: data.data.user._id });
      setLoading(false);
      return data.data.user; // Return user object
    } catch {
      setError('حدث خطأ أثناء تسجيل الدخول');
      setLoading(false);
      return null;
    }
  };

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || 'فشل إنشاء الحساب');
        setLoading(false);
        return false;
      }
      // Auto-login after registration
      const loginSuccess = await login(payload.email, payload.password);
      setLoading(false);
      return loginSuccess;
    } catch {
      setError('حدث خطأ أثناء إنشاء الحساب');
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    // Try to call backend logout endpoint to invalidate token
    if (accessToken) {
      try {
        await fetch(`${API_BASE}/logout`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
        });
      } catch {
        // Ignore errors - we still want to logout locally
        console.log('Backend logout failed, continuing with local logout');
      }
    }

    // Clear all authentication state immediately
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    
    // Clear all stored data
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear any cookies that might be set
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Clear browser history completely to prevent back navigation
    // This is the key to preventing users from going back to authenticated pages
    window.history.pushState(null, '', '/');
    window.history.replaceState(null, '', '/');
    
    // Navigate to landing page with replace to prevent back button
    navigate('/', { replace: true });
    
    // Force a complete page reload to ensure all components re-render
    // This is the most reliable way to prevent any cached state or components
    setTimeout(() => {
      window.location.replace('/');
    }, 50);
  };

  const isAuthenticated = !!user && !!accessToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
        updateUser: (user: User) => setUser(user), // <-- Add this
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 