import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/useLanguage';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import OrganizationLogos from '../../components/layout/OrganizationLogos';

export default function LoginPage() {
  const { login, error, setError } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const success = login(email, password);
    setLoading(false);
    if (success) {
      const lowerEmail = email.toLowerCase();
      let role = 'supervisor';
      if (lowerEmail.includes('admin')) role = 'admin';
      else if (lowerEmail.includes('nurse')) role = 'nurse';
      if (role === 'admin') navigate('/admin');
      else if (role === 'nurse') navigate('/nurse');
      else navigate('/supervisor');
    }
  };

  const fillDemo = (role) => {
    if (role === 'supervisor') {
      setEmail('supervisor@sankalp.in');
      setPassword('supervisor123');
    } else {
      setEmail('admin@sankalp.in');
      setPassword('admin123');
    }
    setError('');
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0F4C75 0%, #0a3254 50%, #071f38 100%)' }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 flex-1 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10">
          <div className="mb-10">
            <OrganizationLogos variant="login" />
          </div>

          <h2 className="text-white text-4xl font-bold leading-snug mb-6 whitespace-pre-line">
            {t('empoweringTitle')}
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed max-w-md">
            {t('empoweringDesc')}
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { num: '1,284', label: t('totalPatients') },
              { num: '98.2%', label: t('accuracyRate') },
              { num: '42', label: t('pendingReviews') },
            ].map(({ num, label }) => (
              <div key={label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-white text-2xl font-bold">{num}</p>
                <p className="text-blue-200 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <div className="flex flex-col items-center justify-center mb-6">
              <OrganizationLogos variant="login" className="mb-3" />
              <h2 className="text-[#0F4C75] text-sm font-bold text-center leading-snug">
                SANKALP — Bedside Counselling & Neonatal Follow-up Management System
              </h2>
            </div>

            <h3 className="text-slate-800 text-2xl font-bold mb-1">{t('welcomeBack')}</h3>
            <p className="text-slate-500 text-base mb-6">{t('signInDesc')}</p>

            {/* Demo credentials */}
            <div className="mb-5 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-500 font-medium mb-2">{t('quickDemo')}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => fillDemo('supervisor')}
                  className="flex-1 text-sm py-2 rounded-lg bg-[#0F4C75] text-white font-semibold hover:bg-[#0a3254] transition-colors"
                >
                  {t('supervisor')}
                </button>
                <button
                  onClick={() => fillDemo('admin')}
                  className="flex-1 text-sm py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors"
                >
                  Admin
                </button>
                <button
                  onClick={() => { setEmail('nurse@sankalp.in'); setPassword('nurse123'); setError(''); }}
                  className="flex-1 text-sm py-2 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-700 transition-colors"
                >
                  Nurse
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-base font-medium text-slate-700 mb-1.5">{t('email')}</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@hospital.gov.in"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-medium text-slate-700 mb-1.5">{t('password')}</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-11 py-3 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-600 text-sm bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  {t('rememberMe')}
                </label>
                <span className="text-blue-600 hover:underline cursor-pointer">{t('forgotPassword')}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ background: loading ? '#94a3b8' : 'linear-gradient(135deg, #0F4C75, #0D9488)' }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                    {t('signingIn')}
                  </>
                ) : t('signIn')}
              </button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-6">
              {t('securedBy')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
