import { useState } from 'react';
import { AuthContext } from './AuthContextBase';

const MOCK_ACCOUNTS = {
  'supervisor@sankalp.in': {
    id: 'sup1',
    name: 'Dr. Arpita Sharma',
    role: 'supervisor',
    designation: 'Senior Supervisor',
    facility: 'SNCU',
    password: 'supervisor123',
  },
  'admin@sankalp.in': {
    id: 'adm1',
    name: 'Dr. Ananya Sharma',
    role: 'admin',
    designation: 'Chief Medical Officer',
    facility: 'All Facilities',
    password: 'admin123',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const login = (email, password) => {
    setError('');
    const account = MOCK_ACCOUNTS[email.toLowerCase()];
    if (!account) {
      setError('Invalid email or password.');
      return false;
    }
    if (account.password !== password) {
      setError('Invalid email or password.');
      return false;
    }
    const { password: _, ...userData } = account;
    setUser(userData);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}
