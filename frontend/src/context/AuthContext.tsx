import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authAPI, usersAPI } from '../services/api';
import AuthModal from '../components/AuthModal';
import { toast } from 'react-hot-toast';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  showAuthModal: (options?: { onSuccess?: () => void }) => void;
  hideAuthModal: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authModalVisible, setAuthModalVisible] = useState<boolean>(false);
  const [modalCallback, setModalCallback] = useState<(() => void) | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const profile = await usersAPI.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = useCallback(
    async (username: string, password: string) => {
      const response = await authAPI.login(username, password);
      const rawToken =
        response?.token ??
        response?.key ??
        response?.access ??
        response?.auth_token ??
        response?.data?.token;

      if (rawToken) {
        const normalizedToken = rawToken.startsWith('Token ') || rawToken.startsWith('Bearer ')
          ? rawToken
          : `Token ${rawToken}`;
        localStorage.setItem('token', normalizedToken);
        setToken(normalizedToken);
      }
      if (response?.user) {
        setUser(response.user);
      } else {
        await fetchProfile();
      }
      setAuthModalVisible(false);
      toast.success('با موفقیت وارد شدید');
    },
    [fetchProfile]
  );

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('با موفقیت خارج شدید');
  }, []);

  const showAuthModal = useCallback((options?: { onSuccess?: () => void }) => {
    if (options?.onSuccess) {
      setModalCallback(() => options.onSuccess);
    }
    setAuthModalVisible(true);
  }, []);

  const hideAuthModal = useCallback(() => {
    setAuthModalVisible(false);
    setModalCallback(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(token),
      user,
      loading,
      login,
      logout,
      showAuthModal,
      hideAuthModal,
    }),
    [token, user, loading, login, logout, showAuthModal, hideAuthModal]
  );

  return (
    <AuthContext.Provider value={value}>
      <AuthModal visible={authModalVisible} onClose={hideAuthModal} onSuccess={() => {
        if (modalCallback) {
          modalCallback();
          setModalCallback(null);
        }
      }} />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
