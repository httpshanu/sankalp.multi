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
  'nurse@sankalp.in': {
    id: 'nur1',
    name: 'Nurse Kavita Devi',
    role: 'nurse',
    designation: 'Staff Nurse',
    facility: 'CHC-Bhadrabad',
    password: 'nurse123',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('sankalp_auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
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
    try {
      localStorage.setItem('sankalp_auth_user', JSON.stringify(userData));
    } catch {}
    return true;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('sankalp_auth_user');
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}
