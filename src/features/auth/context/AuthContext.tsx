import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { RolId } from '../../../types/roles';

interface AuthContextType {
  user: any;
  token: string | null;
  roleId: RolId | null;
  isAuthenticated: boolean;
  login: (token: string, user: any, roleId: RolId) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || 'null'));
  const storedRoleId = localStorage.getItem('roleId');
  const [roleId, setRoleId] = useState<RolId | null>(storedRoleId ? parseInt(storedRoleId, 10) as RolId : null);

  const login = (newToken: string, newUser: any, newRoleId: RolId) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('roleId', newRoleId.toString());
    setToken(newToken);
    setUser(newUser);
    setRoleId(newRoleId);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('roleId');
    setToken(null);
    setUser(null);
    setRoleId(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, roleId, isAuthenticated, login, logout }}>
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
