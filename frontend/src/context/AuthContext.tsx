import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authAPI, usersAPI } from '../services/api';
import AuthModal from '../components/AuthModal';
import { toast } from 'react-hot-toast';
import { authTokenStore } from '../services/authToken';

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
  const [token, setToken] = useState<string | null>(() => authTokenStore.get());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(authTokenStore.get()));
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authModalVisible, setAuthModalVisible] = useState<boolean>(false);
  const [modalCallback, setModalCallback] = useState<(() => void) | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const profile = await usersAPI.getProfile();
      setUser(profile);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      authTokenStore.clear();
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (token) {
      authTokenStore.set(token);
    }
  }, [token]);

  const login = useCallback(
    async (username: string, password: string) => {
      const response = await authAPI.login(username, password);
      const rawToken =
        response?.token ??
        response?.key ??
        response?.access ??
        response?.access_token ??
        response?.auth_token ??
        response?.data?.token ??
        response?.data?.access_token;

      const refreshToken =
        response?.refresh ??
        response?.refresh_token ??
        response?.data?.refresh ??
        response?.data?.refresh_token;

      if (rawToken) {
        let normalizedToken = rawToken;
        if (!/^token\s+/i.test(rawToken) && !/^bearer\s+/i.test(rawToken)) {
          const tokenType =
            (typeof response?.token_type === 'string' && response.token_type.trim()) ||
            (rawToken.includes('.') ? 'Bearer' : 'Token');
          normalizedToken = `${tokenType} ${rawToken}`;
        }
        localStorage.setItem('token', normalizedToken);
        authTokenStore.set(normalizedToken);
        setToken(normalizedToken);
        setIsAuthenticated(true);
      }
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      if (response?.user) {
        setUser(response.user);
        setIsAuthenticated(true);
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
    authTokenStore.clear();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
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
      isAuthenticated,
      user,
      loading,
      login,
      logout,
      showAuthModal,
      hideAuthModal,
    }),
    [isAuthenticated, user, loading, login, logout, showAuthModal, hideAuthModal]
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
