import AppLayout from '../../components/layout/AppLayout';
import { useLanguage } from '../../context/useLanguage';
import { MOCK_FACILITIES } from '../../data/mockData';
import { Building2, Plus, Edit, Users } from 'lucide-react';

export default function Facilities() {
  const { t } = useLanguage();
  return (
    <AppLayout title={t('facilities')}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t('facilityManagement')}</h1>
          <p className="text-slate-500 text-sm">{MOCK_FACILITIES.length} {t('activeFacilities')}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg,#0F4C75,#1B6CA8)' }}>
          <Plus size={16} /> {t('addFacility')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_FACILITIES.map(f => (
          <div key={f.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#0F4C75]/10 flex items-center justify-center">
                  <Building2 size={22} className="text-[#0F4C75]" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{f.name}</h3>
                  <p className="text-slate-500 text-sm">{f.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${f.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {f.active ? t('active') : t('inactive')}
                </span>
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Edit size={14} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-400 mb-1">{t('head')}</p>
                <p className="text-sm font-medium text-slate-700">{f.head}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">{t('patients')}</p>
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-slate-400" />
                  <p className="text-sm font-semibold text-slate-800">{f.cases}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
